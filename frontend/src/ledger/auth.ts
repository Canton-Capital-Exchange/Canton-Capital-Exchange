const MODE        = import.meta.env.VITE_AUTH_MODE   as string | undefined;
const DEVNET_PARTY = import.meta.env.VITE_DEVNET_PARTY as string | undefined;
export const AUTH_MODE = MODE;
// Participant fingerprint extracted from VITE_DEVNET_PARTY (the part after ::).
// Used by bootstrap to construct deterministic DevNet party IDs.
export const DEVNET_PARTICIPANT = DEVNET_PARTY?.split("::")[1];

const TOKEN_KEY    = "ccx_token";
const PARTY_KEY    = "ccx_party";
const USER_KEY     = "ccx_user_id";
const EXPIRY_KEY   = "ccx_token_expiry";
const STATE_KEY    = "ccx_oauth_state";
const VERIFIER_KEY = "ccx_pkce_verifier";

const KC_URL    = import.meta.env.VITE_KEYCLOAK_URL as string;
const KC_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  const verifier = base64url(raw.buffer);
  const digest   = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: base64url(digest) };
}

// ── Keycloak (Authorization Code + PKCE) ──────────────────────────────────────

export async function loginRedirect() {
  const state = crypto.randomUUID();
  const { verifier, challenge } = await generatePKCE();
  sessionStorage.setItem(STATE_KEY,    state);
  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id:              KC_CLIENT,
    response_type:          "code",
    redirect_uri:           window.location.origin,
    scope:                  "openid",
    state,
    code_challenge:         challenge,
    code_challenge_method:  "S256",
  });
  window.location.href = `${KC_URL}/protocol/openid-connect/auth?${params}`;
}

export function logout() {
  sessionStorage.clear();
  window.location.href =
    `${KC_URL}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`;
}

// ── Machine token (client_credentials via Netlify Function — secret is server-side) ──

async function fetchMachineToken(): Promise<{ token: string; expiresIn: number }> {
  const res = await fetch("/.netlify/functions/m2m-token", { method: "POST" });
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status} ${await res.text()}`);
  const { access_token, expires_in } = await res.json() as { access_token: string; expires_in?: number };
  return { token: access_token, expiresIn: expires_in ?? 28800 };
}

// ── Shared ────────────────────────────────────────────────────────────────────

function decodeSub(token: string): string {
  try {
    return (JSON.parse(atob(token.split(".")[1])) as { sub: string }).sub;
  } catch {
    return "";
  }
}

async function resolveParty(token: string, sub: string): Promise<string> {
  const res = await fetch(`/v2/users/${encodeURIComponent(sub)}/rights`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Party resolution failed: ${res.status}`);
  const body = await res.json() as {
    actAsGrants?: { party: string }[];
    rights?: { kind?: { CanActAs?: { value?: { party?: string } } } }[];
  };
  // Canton JSON API v2 (some nodes): {actAsGrants: [{party}]}
  if (body.actAsGrants?.[0]?.party) return body.actAsGrants[0].party;
  // FiveNorth / alternate format: {rights: [{kind: {CanActAs: {value: {party}}}}]}
  for (const r of body.rights ?? []) {
    const p = r.kind?.CanActAs?.value?.party;
    if (p) return p;
  }
  return "";
}

function storeSession(token: string, expiresIn: number, party: string, userId: string) {
  sessionStorage.setItem(TOKEN_KEY,  token);
  sessionStorage.setItem(EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
  sessionStorage.setItem(PARTY_KEY,  party);
  sessionStorage.setItem(USER_KEY,   userId);
}

export function getStoredToken():  string { return sessionStorage.getItem(TOKEN_KEY)  ?? ""; }
export function getStoredParty(): string  { return sessionStorage.getItem(PARTY_KEY)  ?? ""; }
export function getStoredUserId(): string { return sessionStorage.getItem(USER_KEY)   ?? "ccx-app"; }

// ── initAuth ──────────────────────────────────────────────────────────────────

export async function initAuth(
  setToken: (t: string) => void,
): Promise<"authed" | "needs_login" | "sandbox"> {
  if (!MODE) return "sandbox";

  if (MODE === "client_credentials") {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    const expiry = Number(sessionStorage.getItem(EXPIRY_KEY) ?? 0);
    if (stored && Date.now() < expiry - 60_000) {
      setToken(stored);
      return "authed";
    }
    const { token, expiresIn } = await fetchMachineToken();
    const sub = decodeSub(token);
    // VITE_DEVNET_PARTY overrides resolution — needed when the machine account
    // can act as many parties (shared sandbox) and we want a specific one.
    const party = DEVNET_PARTY ?? await resolveParty(token, sub);
    storeSession(token, expiresIn, party, sub);
    setToken(token);
    return "authed";
  }

  if (MODE === "keycloak") {
    const params       = new URLSearchParams(window.location.search);
    const code         = params.get("code");
    const returnedState = params.get("state");

    if (code) {
      const storedState = sessionStorage.getItem(STATE_KEY);
      if (!storedState || returnedState !== storedState) {
        throw new Error("OAuth state mismatch — possible CSRF, please try logging in again");
      }
      const verifier = sessionStorage.getItem(VERIFIER_KEY) ?? "";
      sessionStorage.removeItem(STATE_KEY);
      sessionStorage.removeItem(VERIFIER_KEY);

      const res = await fetch(`${KC_URL}/protocol/openid-connect/token`, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    new URLSearchParams({
          grant_type:    "authorization_code",
          client_id:     KC_CLIENT,
          code,
          redirect_uri:  window.location.origin,
          code_verifier: verifier,
        }),
      });
      if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
      const { access_token, expires_in } = await res.json() as { access_token: string; expires_in?: number };
      const sub   = decodeSub(access_token);
      const party = await resolveParty(access_token, sub);
      storeSession(access_token, expires_in ?? 10800, party, sub);
      window.history.replaceState({}, "", window.location.pathname);
      setToken(access_token);
      return "authed";
    }

    const stored = sessionStorage.getItem(TOKEN_KEY);
    const expiry = Number(sessionStorage.getItem(EXPIRY_KEY) ?? 0);
    if (stored && Date.now() < expiry - 60_000) {
      setToken(stored);
      return "authed";
    }
    return "needs_login";
  }

  return "sandbox";
}

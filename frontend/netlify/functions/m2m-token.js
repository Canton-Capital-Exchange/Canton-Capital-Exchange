// Proxies the client_credentials token exchange server-side so the
// client secret never appears in the browser bundle.
//
// Security posture:
//   - Origin is checked against Netlify's $URL env var (auto-set per deploy).
//     This blocks cross-origin calls; it is bypassable server-to-server but
//     raises the bar above "anyone who guesses the URL".
//   - The client_credentials grant is inherently machine-to-machine: there is
//     no per-user session to gate on, so "verify a user JWT first" does not
//     apply to this auth mode. The credential gives access to a hackathon
//     DevNet only, scoped to daml_ledger_api.
//   - For a production deployment, replace client_credentials with per-user
//     Authorization Code + PKCE (keycloak mode) and retire this function.

export const handler = async (event) => {
  // Origin guard — rejects requests that didn't come from this Netlify site.
  // Netlify sets URL to the primary site URL automatically.
  const siteUrl    = (process.env.URL ?? "").replace(/\/$/, "");
  const origin     = (event.headers.origin ?? "").replace(/\/$/, "");
  if (siteUrl && origin !== siteUrl) {
    return { statusCode: 403, body: "Forbidden" };
  }

  const tokenUrl = process.env.AUTH_TOKEN_URL;
  if (!tokenUrl) {
    return { statusCode: 503, body: "AUTH_TOKEN_URL not configured" };
  }

  const res = await fetch(tokenUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     process.env.AUTH_CLIENT_ID     ?? "",
      client_secret: process.env.AUTH_CLIENT_SECRET ?? "",
      audience:      process.env.AUTH_AUDIENCE      ?? "",
      scope:         process.env.AUTH_SCOPE         ?? "daml_ledger_api",
    }),
  });

  const body = await res.text();
  if (!res.ok) return { statusCode: res.status, body };

  const { access_token, expires_in } = JSON.parse(body);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token, expires_in }),
  };
};

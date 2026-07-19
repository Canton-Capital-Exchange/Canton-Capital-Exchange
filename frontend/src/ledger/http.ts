import createClient from "openapi-fetch";
import type { paths } from "../generated/ledger-api";

// Relative baseUrl: the Vite dev server (and, in Docker, the frontend
// container's nginx config) proxies /v2/* to the Canton sandbox's JSON
// Ledger API, so the browser never talks to it directly and there is no
// CORS configuration to manage.

let _token = "";

export function setAuthToken(t: string) {
  _token = t;
}

const authFetch: typeof fetch = (input, init?) => {
  if (!_token) return fetch(input, init);
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${_token}`);
  return fetch(input, { ...(init ?? {}), headers });
};

export const client = createClient<paths>({ baseUrl: "", fetch: authFetch });

export function unwrap<T>(data: T | undefined, error: unknown): T {
  if (data === undefined) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
  return data;
}

import createClient from "openapi-fetch";
import type { paths } from "../generated/ledger-api";

// Relative baseUrl: the Vite dev server (and, in Docker, the frontend
// container's nginx config) proxies /v2/* to the Canton sandbox's JSON
// Ledger API, so the browser never talks to it directly and there is no
// CORS configuration to manage.
export const client = createClient<paths>({ baseUrl: "" });

export function unwrap<T>(data: T | undefined, error: unknown): T {
  if (data === undefined) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
  return data;
}

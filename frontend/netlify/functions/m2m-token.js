// Proxies the client_credentials token exchange server-side so
// AUTH_CLIENT_SECRET never appears in the JS bundle.
export const handler = async () => {
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

#!/usr/bin/env node
// Generates public/_redirects with the ledger proxy rule from LEDGER_URL.
// Run automatically as part of `npm run build:netlify` before vite build.

const fs = require("fs");

const url = process.env.LEDGER_URL;
if (!url) {
  console.log("LEDGER_URL not set — skipping _redirects generation (sandbox build)");
  process.exit(0);
}

const ledger = url.replace(/\/$/, "");
const content = `/v2/*  ${ledger}/v2/:splat  200\n`;

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/_redirects", content);
console.log(`Generated public/_redirects → ${ledger}/v2/*`);

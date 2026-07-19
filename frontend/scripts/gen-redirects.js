import { mkdirSync, writeFileSync } from "fs";

const url = process.env.LEDGER_URL;
if (!url) {
  console.log("LEDGER_URL not set — skipping _redirects generation (sandbox build)");
  process.exit(0);
}

const ledger = url.replace(/\/$/, "");
mkdirSync("public", { recursive: true });
writeFileSync("public/_redirects", `/v2/*  ${ledger}/v2/:splat  200\n`);
console.log(`Generated public/_redirects → ${ledger}/v2/*`);

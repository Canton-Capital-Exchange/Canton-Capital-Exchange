// Set VITE_REAL_TOKENS=true when running against DevNet with real cETH/cBTC/raUSD.
// Skips sandbox seeding in bootstrap; switches client.ts to query via Splice token interfaces.
export const USE_REAL_TOKENS = import.meta.env.VITE_REAL_TOKENS === "true";

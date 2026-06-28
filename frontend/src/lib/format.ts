import { partyIdToPersona } from "../ledger/parties";

export function displayName(partyId: string): string {
  return partyIdToPersona.get(partyId)?.displayName ?? partyId.split("::")[0];
}

export function money(amount: string, currency: string): string {
  const n = Number(amount);
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function percent(decimalFraction: string): string {
  return `${(Number(decimalFraction) * 100).toFixed(2)}%`;
}

export function bpsToPercent(bps: string | number): string {
  return `${(Number(bps) / 100).toFixed(2)}%`;
}

export function shortDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function daysUntil(isoDate: string): number {
  const ms = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

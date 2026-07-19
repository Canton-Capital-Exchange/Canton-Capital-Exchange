import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPersonaView, type PersonaView } from "../ledger/client";

const POLL_INTERVAL_MS = 2000;

/**
 * Polls the ledger AS `partyId` on an interval. There is no client-side
 * cache shared across personas and no filtering applied here -- every poll
 * is a fresh query against the JSON Ledger API for exactly this party, so
 * switching personas always reflects what that party's node can actually
 * see right now.
 */
export function useLedgerView(partyId: string) {
  const [view, setView] = useState<PersonaView | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    if (!partyId) return;
    const myGeneration = generation.current;
    setPending(true);
    try {
      const next = await fetchPersonaView(partyId);
      if (generation.current === myGeneration) {
        setView(next);
        setError(null);
      }
    } catch (e) {
      if (generation.current === myGeneration) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      if (generation.current === myGeneration) {
        setPending(false);
      }
    }
  }, [partyId]);

  useEffect(() => {
    generation.current += 1;
    setView(null);
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [partyId, refresh]);

  return { view, pending, error, refresh };
}

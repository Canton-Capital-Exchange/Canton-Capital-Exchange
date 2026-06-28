import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { resolveParties } from "./bootstrap";
import type { PersonaId } from "./parties";

interface PartiesState {
  parties: Record<PersonaId, string> | null;
  error: string | null;
}

const PartiesContext = createContext<PartiesState>({ parties: null, error: null });

/**
 * Resolves (and allocates/seeds if missing) the five demo parties exactly
 * once when the app boots, then makes the resulting party IDs available to
 * the whole tree. Nothing else in the app ever hardcodes a party ID.
 */
export function PartiesProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PartiesState>({ parties: null, error: null });

  useEffect(() => {
    resolveParties()
      .then((parties) => setState({ parties, error: null }))
      .catch((e) => setState({ parties: null, error: e instanceof Error ? e.message : String(e) }));
  }, []);

  return <PartiesContext.Provider value={state}>{children}</PartiesContext.Provider>;
}

export function useParties(): PartiesState {
  return useContext(PartiesContext);
}

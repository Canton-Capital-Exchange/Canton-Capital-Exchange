import { useEffect, useState } from "react";

type Listener = (txId: string) => void;
let listeners: Listener[] = [];

export function broadcastTx(txId: string) {
  listeners.forEach((fn) => fn(txId));
}

export function useTxToast(timeoutMs = 10_000) {
  const [txId, setTxId] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler: Listener = (id) => {
      setTxId(id);
      clearTimeout(timer);
      timer = setTimeout(() => setTxId(null), timeoutMs);
    };
    listeners.push(handler);
    return () => {
      clearTimeout(timer);
      listeners = listeners.filter((l) => l !== handler);
    };
  }, [timeoutMs]);

  return txId;
}

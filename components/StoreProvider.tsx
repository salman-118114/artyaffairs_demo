"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { BagItem, Currency } from "@/lib/types";
import { Icon } from "./Icon";

type Toast = { msg: string; action?: { label: string; run: () => void } } | null;

interface Store {
  bag: BagItem[];
  ready: boolean; // true once the bag has been read from localStorage
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fmt: (inr: number, cur?: Currency) => string;
  add: (item: Omit<BagItem, "key" | "qty"> & { qty?: number }, opts?: { silent?: boolean }) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  toast: (msg: string, action?: { label: string; run: () => void }) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
}

const read = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } };

export function StoreProvider({ rates, children }: { rates: Record<Currency, number>; children: React.ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [ready, setReady] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [bagOpen, setBagOpen] = useState(false);
  const [toastState, setToast] = useState<Toast>(null);
  const [toastOn, setToastOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read persisted state after mount so server and first client render match.
  useEffect(() => {
    setBag(read<BagItem[]>("aa-bag", []));
    setCurrencyState(read<Currency>("aa-cur-v2", "INR"));
    setReady(true);
  }, []);

  const saveBag = useCallback((next: BagItem[]) => { setBag(next); write("aa-bag", next); }, []);
  const setCurrency = useCallback((c: Currency) => { setCurrencyState(c); write("aa-cur-v2", c); }, []);
  const fmt = useCallback((inr: number, cur?: Currency) => formatPrice(inr, cur ?? currency, rates), [currency, rates]);

  const toast = useCallback((msg: string, action?: { label: string; run: () => void }) => {
    setToast({ msg, action });
    requestAnimationFrame(() => setToastOn(true));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastOn(false), 3800);
  }, []);

  const add: Store["add"] = useCallback((item, opts) => {
    setBag((prev) => {
      const key = item.id + "|" + JSON.stringify(item.options || {});
      const found = prev.find((x) => x.key === key);
      const next = found
        ? prev.map((x) => (x.key === key ? { ...x, qty: x.qty + (item.qty ?? 1) } : x))
        : [...prev, { ...item, key, qty: item.qty ?? 1, options: item.options || {} }];
      write("aa-bag", next);
      return next;
    });
    if (!opts?.silent) toast(`${item.name} added to your bag`, { label: "View bag", run: () => setBagOpen(true) });
  }, [toast]);

  const setQty = useCallback((key: string, qty: number) => {
    setBag((prev) => { const next = qty <= 0 ? prev.filter((x) => x.key !== key) : prev.map((x) => (x.key === key ? { ...x, qty } : x)); write("aa-bag", next); return next; });
  }, []);

  const value = useMemo<Store>(() => ({
    bag, ready, currency, setCurrency, fmt, add, setQty, clear: () => saveBag([]),
    total: bag.reduce((s, x) => s + x.price * x.qty, 0), count: bag.reduce((s, x) => s + x.qty, 0),
    bagOpen, setBagOpen, toast,
  }), [bag, ready, currency, setCurrency, fmt, add, setQty, saveBag, bagOpen, toast]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className={`toast${toastOn ? " is-on" : ""}`} role="status" aria-live="polite">
        {toastState && (<>
          <Icon name="check" />
          <span>{toastState.msg}</span>
          {toastState.action && (
            <button type="button" className="toast-action" onClick={() => { setToastOn(false); toastState.action!.run(); }}>
              {toastState.action.label}
            </button>
          )}
        </>)}
      </div>
    </StoreContext.Provider>
  );
}

/** A price that follows the visitor's chosen currency. Server-renders in INR. */
export function Price({ inr, className = "price" }: { inr: number; className?: string }) {
  const { fmt } = useStore();
  return <span className={className}>{fmt(inr)}</span>;
}

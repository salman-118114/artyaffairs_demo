"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/StoreProvider";

/** Copies the event code and remembers it for checkout (auto-applied there). */
export function CopyCode({ code, percent }: { code: string; percent: number }) {
  const { toast } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("aa-code", code);
      sessionStorage.setItem("aa-src", new URLSearchParams(location.search).get("src") || "event");
    } catch { /* private mode */ }
  }, [code]);

  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); } catch { setCopied(false); }
    toast(`${code} will be applied at checkout`);
  }

  return (
    <div className="hero-actions" style={{ ["--i" as string]: 4, justifyContent: "center" }}>
      <button className="btn btn--light" type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy code"}</button>
      <Link className="btn btn--ghost-light" href="/shop">Shop with {percent}% off</Link>
    </div>
  );
}

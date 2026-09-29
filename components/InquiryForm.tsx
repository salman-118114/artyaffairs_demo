"use client";

import { useRef, useState } from "react";
import { site, waLink } from "@/lib/site";
import { submitInquiry } from "@/lib/submit";
import { Icon } from "./Icon";

/**
 * Wraps an enquiry form: validates, posts to /api/inquiry, then swaps in a success panel
 * with a "send on WhatsApp" hand-off carrying the same details.
 */
export function InquiryForm({ kind, title, success, waLabel = "Also send on WhatsApp", className, style, children }: {
  kind: string; title: string; success: React.ReactNode; waLabel?: string;
  className?: string; style?: React.CSSProperties; children: React.ReactNode;
}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    setBusy(true);
    const res = await submitInquiry(kind, new FormData(f));
    setBusy(false);
    setSummary(res.summary);
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  if (summary !== null) {
    return (
      <div className="form-success" ref={doneRef} tabIndex={-1}>
        <Icon name="check" className="" />
        {success}
        <a className="btn btn--wa" href={waLink(`Hi Arty Affairs! I just sent a ${title}:\n${summary}`, site.whatsapp)} target="_blank" rel="noopener">
          <Icon name="wa" className="" /> {waLabel}
        </a>
      </div>
    );
  }
  return (
    <form className={className} style={style} onSubmit={onSubmit} noValidate aria-busy={busy}>
      {children}
    </form>
  );
}

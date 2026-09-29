/* Receives every site form (commissions, wedding, corporate, workshop bookings, reminders, newsletter).
 * Set INQUIRY_WEBHOOK_URL to forward submissions (Google Apps Script → Sheet, Zapier/Make, Slack, n8n…).
 * Without it, submissions are written to the server log so nothing is lost while testing. */
import { NextResponse } from "next/server";

const KINDS = new Set(["newsletter", "reminder", "commission", "wedding", "corporate", "booking", "private-workshop"]);

export async function POST(req: Request) {
  let body: { kind?: string; fields?: Record<string, string> };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  const kind = String(body.kind || "");
  const fields = body.fields && typeof body.fields === "object" ? body.fields : {};
  if (!KINDS.has(kind)) return NextResponse.json({ ok: false, error: "Unknown form" }, { status: 400 });

  // Keep payloads small and plain-text.
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields).slice(0, 40)) clean[String(k).slice(0, 60)] = String(v).slice(0, 2000);
  const record = { kind, fields: clean, receivedAt: new Date().toISOString() };

  const hook = process.env.INQUIRY_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[inquiry] forward failed", err, record);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } else {
    console.log("[inquiry]", JSON.stringify(record));
  }
  return NextResponse.json({ ok: true });
}

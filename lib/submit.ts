/** Sends a form to /api/inquiry. Files are summarised by name (upload them via WhatsApp or a storage service). */
export async function submitInquiry(kind: string, fd: FormData): Promise<{ ok: boolean; summary: string }> {
  const fields: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    const val = typeof v === "string" ? v : v.name ? `[file] ${v.name}` : "";
    if (!val) continue;
    fields[k] = fields[k] ? `${fields[k]}, ${val}` : val;
  }
  const summary = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, fields }) });
    return { ok: res.ok, summary };
  } catch {
    return { ok: false, summary };
  }
}

"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Image picker with drag-over state and thumbnail previews. */
export function UploadField({ name, label, hint }: { name: string; label: string; hint: string }) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [drag, setDrag] = useState(false);
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.url)), [files]);

  return (
    <>
      <label className={`upload${drag ? " is-drag" : ""}`} onDragEnter={() => setDrag(true)} onDragOver={() => setDrag(true)} onDragLeave={() => setDrag(false)} onDrop={() => setDrag(false)}>
        <Icon name="upload" className="" />
        <b style={{ fontWeight: 500 }}>{label}</b>
        <span className="hint">{hint}{files.length ? ` · ${files.length} file${files.length > 1 ? "s" : ""} selected` : ""}</span>
        <input type="file" name={name} accept="image/*" multiple aria-label={label}
          onChange={(e) => setFiles([...(e.target.files ?? [])].filter((f) => f.type.startsWith("image/")).slice(0, 6).map((f) => ({ name: f.name, url: URL.createObjectURL(f) })))} />
      </label>
      {files.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="upload-previews">{files.map((f) => <img key={f.url} src={f.url} alt={f.name} />)}</div>
      )}
    </>
  );
}

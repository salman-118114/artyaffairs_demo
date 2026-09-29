"use client";

import { useRef, useState } from "react";
import { ArtSvg } from "@/components/Art";
import { Icon } from "@/components/Icon";

export type Work = { type: string; tone: string; title: string; meta: string; cat: string; ratio: string; text?: string };

const FILTERS: [string, string][] = [["all", "All work"], ["calligraphy", "Calligraphy"], ["resin", "Resin"], ["painting", "Paintings"], ["wedding", "Weddings"]];

export function GalleryGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const lb = useRef<HTMLDialogElement>(null);

  const show = (i: number) => { setOpen(i); lb.current?.showModal(); };
  const w = open != null ? works[open] : null;

  return (
    <>
      <div className="chips" role="toolbar" aria-label="Filter the gallery" style={{ display: "flex", marginBottom: "var(--space-5)" }}>
        {FILTERS.map(([k, t]) => <button key={k} className="chip" type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{t}</button>)}
      </div>
      <div className="masonry" style={{ paddingBottom: "var(--section)" }}>
        {works.map((x, i) => (
          <figure key={x.title} className="reveal" style={{ ["--i" as string]: i % 3 }} hidden={filter !== "all" && x.cat !== filter}>
            <button type="button" className="frame clip clip--iris" style={{ aspectRatio: x.ratio, ["--cd" as string]: `${(i % 3) * 80}ms` }} aria-label={`View ${x.title} larger`} onClick={() => show(i)}>
              <ArtSvg spec={{ type: x.type, tone: x.tone, text: x.text, seed: `gal${i}`, label: x.title }} />
            </button>
            <figcaption><b>{x.title}</b>{x.meta}</figcaption>
          </figure>
        ))}
      </div>
      <dialog className="lightbox" ref={lb} aria-label={w?.title ?? "Artwork"} onClick={(e) => { if (e.target === lb.current) lb.current?.close(); }}>
        <button className="icon-btn lb-close" type="button" aria-label="Close" onClick={() => lb.current?.close()}><Icon name="close" className="" /></button>
        {w && open != null && (<>
          <div className="frame"><ArtSvg spec={{ type: w.type, tone: w.tone, text: w.text, seed: `gal${open}`, label: w.title }} /></div>
          <p>{w.title} · {w.meta}</p>
        </>)}
      </dialog>
    </>
  );
}

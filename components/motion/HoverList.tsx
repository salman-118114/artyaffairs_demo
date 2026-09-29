"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState } from "react";
import { ArtSvg } from "@/components/Art";
import type { ArtSpec } from "@/lib/types";

export type HoverItem = { href: string; title: string; sub: string; art: ArtSpec };

/**
 * Editorial index: big numbered rows. On desktop a framed preview follows the pointer
 * (spring-smoothed) and swaps as you move between rows; on touch each row shows its thumbnail.
 */
export function HoverList({ items }: { items: HoverItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  return (
    <div className="hover-list" onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - r.left); y.set(e.clientY - r.top);
    }} onPointerLeave={() => setActive(null)}>
      <ol>
        {items.map((it, i) => (
          <li key={it.href}>
            <Link href={it.href} className="hover-row" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
              <span className="hover-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hover-title">{it.title}</span>
              <span className="hover-sub">{it.sub}</span>
              <span className="hover-thumb" aria-hidden="true"><ArtSvg spec={{ ...it.art, label: undefined }} /></span>
              <span className="hover-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
      <motion.div className="hover-preview" aria-hidden="true" style={{ x: sx, y: sy }}>
        <AnimatePresence mode="popLayout">
          {active !== null && (
            <motion.div key={active} className="hover-preview-inner"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, clipPath: "inset(12% 12% 12% 12%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}>
              {/* Distinct seed → distinct SVG ids; otherwise gradients resolve to the hidden thumbnail copy. */}
              <ArtSvg spec={{ ...items[active].art, seed: `${items[active].art.seed}-preview`, label: undefined }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArtSvg } from "@/components/Art";
import type { ArtSpec } from "@/lib/types";

/** Three columns of images drifting at different speeds — a slow, layered studio wall. */
export function ParallaxColumns({ columns, href }: { columns: (ArtSpec & { label: string })[][]; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const speeds = [-60, 50, -110];
  const ys = [
    useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, speeds[0]]),
    useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, speeds[1]]),
    useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, speeds[2]]),
  ];
  return (
    <div ref={ref} className="pcols">
      {columns.map((col, c) => (
        <motion.div key={c} className="pcol" style={{ y: ys[c] }}>
          {col.map((a) => (
            <a key={a.seed} href={href} rel="noopener" aria-label={a.label} className="pcol-item">
              <ArtSvg spec={{ ...a, label: undefined }} />
            </a>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

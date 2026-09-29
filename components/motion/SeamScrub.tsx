"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { seamSvg } from "@/lib/art";

/** The kintsugi seam, drawn left→right in step with scroll (clip-path, compositor-friendly). */
export function SeamScrub({ seed, className = "" }: { seed: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.35"] });
  const right = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(right, (r) => `inset(-20px ${reduce ? 0 : r}% -20px 0)`);
  return (
    <div ref={ref} className={`seam-scrub ${className}`} aria-hidden="true">
      <motion.div style={{ clipPath }} dangerouslySetInnerHTML={{ __html: seamSvg(seed) }} />
    </div>
  );
}

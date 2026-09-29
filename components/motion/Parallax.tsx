"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Moves its content vertically as the element crosses the viewport (depth cue). */
export function Parallax({ children, distance = 60, className, style }: {
  children: React.ReactNode; distance?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance]);
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y, height: "100%" }}>{children}</motion.div>
    </div>
  );
}

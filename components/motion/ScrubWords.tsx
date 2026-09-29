"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** A statement whose words ink in as you scroll through it — reading pace set by the reader.
 *  Markup is identical with or without reduced motion (the server can't know the setting),
 *  so hydration always matches; reduced motion just holds every word at full ink. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={still}>{w}</Word>)}
      </span>
    </p>
  );
}

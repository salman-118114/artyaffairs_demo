"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ArtSvg } from "@/components/Art";
import type { ArtSpec } from "@/lib/types";

export type StackCard = { title: string; body: string; art: ArtSpec; note: string };

function Card({ card, i, total, progress }: { card: StackCard; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // Each card shrinks slightly as the ones after it slide over — the deck recedes.
  const scale = useTransform(progress, [i / total, 1], [1, reduce ? 1 : 1 - (total - i) * 0.035]);
  const dim = useTransform(progress, [i / total, 1], [0, reduce ? 0 : 0.35]);
  return (
    <li className="stack-card" style={{ top: `calc(6rem + ${i * 1.25}rem)` }}>
      <motion.div className="stack-inner" style={{ scale }}>
        <div className="stack-text">
          <span className="stack-num">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <span className="stack-note">{card.note}</span>
        </div>
        <div className="stack-art"><ArtSvg spec={card.art} /></div>
        <motion.span className="stack-dim" style={{ opacity: dim }} aria-hidden="true" />
      </motion.div>
    </li>
  );
}

/** Sticky stacked cards for a sequential process. */
export function StackCards({ cards }: { cards: StackCard[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <ol className="stack" ref={ref}>
      {cards.map((c, i) => <Card key={c.title} card={c} i={i} total={cards.length} progress={scrollYProgress} />)}
    </ol>
  );
}

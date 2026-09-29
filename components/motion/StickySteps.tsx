"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArtSvg } from "@/components/Art";
import type { ArtSpec } from "@/lib/types";

export type Step = { title: string; body: string; art: ArtSpec };

function StepBlock({ step, index, onActive }: { step: Step; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) onActive(index); }, [inView, index, onActive]);
  return (
    <li ref={ref} className={`sstep${inView ? " is-active" : ""}`}>
      <span className="sstep-num">{String(index + 1).padStart(2, "0")}</span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </li>
  );
}

/** Scrollytelling: the arch on the left stays put and changes picture as each step reaches the middle. */
export function StickySteps({ steps, intro, footer }: { steps: Step[]; intro: React.ReactNode; footer?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="ssteps container">
      <div className="ssteps-visual">
        <div className="frame frame--arch ssteps-frame">
          <AnimatePresence initial={false}>
            <motion.div key={active} className="ssteps-img"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}>
              <ArtSvg spec={steps[active].art} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="ssteps-dots" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i === active ? "on" : ""} />)}</div>
      </div>
      <div className="ssteps-copy">
        {intro}
        <ol>{steps.map((s, i) => <StepBlock key={s.title} step={s} index={i} onActive={setActive} />)}</ol>
        {footer}
      </div>
    </div>
  );
}

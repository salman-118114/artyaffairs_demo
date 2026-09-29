"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ArtSvg } from "@/components/Art";
import type { Review } from "@/lib/types";

const AUTOPLAY_MS = 7000;

/**
 * One large quote at a time. Crossfades with a short upward drift; a hairline fills to show
 * time until the next. Autoplay stops on hover/focus and is off entirely with reduced motion.
 */
export function Testimonials({ reviews, productNames }: { reviews: Review[]; productNames: Record<string, string> }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const go = useCallback((d: number) => setI((v) => (v + d + reviews.length) % reviews.length), [reviews.length]);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [i, paused, reduce, go]);

  const r = reviews[i];
  return (
    <div className="tslider" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-roledescription="carousel" aria-label="Customer reviews">
      <div className="tslider-art">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={i} className="tslider-img" initial={{ opacity: 0, clipPath: reduce ? "inset(0)" : "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}>
            <ArtSvg spec={{ type: r.photo, tone: r.photo === "name" ? "cream" : "emerald", seed: `ts-${r.name}`, label: `Customer photo of ${productNames[r.product] ?? "their order"}` }} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="tslider-body">
        <div className="tslider-quote" aria-live={paused ? "polite" : "off"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure key={i} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}>
              <blockquote><p>“{r.text}”</p></blockquote>
              <figcaption><b>{r.name}</b> · {r.city}{productNames[r.product] ? <> · <span>{productNames[r.product]}</span></> : null}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="tslider-controls">
          <span className="tslider-count">{String(i + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span>
          <div className="tslider-bar" aria-hidden="true">
            <motion.i key={`${i}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused || reduce ? 0 : 1 }}
              transition={{ duration: paused || reduce ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }} />
          </div>
          <button type="button" className="tslider-btn" onClick={() => go(-1)} aria-label="Previous review">←</button>
          <button type="button" className="tslider-btn" onClick={() => go(1)} aria-label="Next review">→</button>
        </div>
      </div>
    </div>
  );
}

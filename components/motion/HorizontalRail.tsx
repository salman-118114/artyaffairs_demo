"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Pinned horizontal gallery: on large screens the section sticks and vertical scroll moves the
 * track sideways. On phones, tablets and with reduced motion it is a normal swipeable rail.
 */
export function HorizontalRail({ children, header }: { children: React.ReactNode; header: React.ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(mq.matches);
      const t = track.current; if (!t) return;
      setDistance(Math.max(0, t.scrollWidth - t.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure); if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    return () => { ro.disconnect(); mq.removeEventListener("change", measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={section} className={`hrail${pinned ? " is-pinned" : ""}`} style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
      <div className="hrail-sticky">
        <div className="container">{header}</div>
        <div className="hrail-viewport">
          <motion.div ref={track} className="hrail-track" style={pinned ? { x } : undefined}>{children}</motion.div>
        </div>
        {pinned && <div className="container"><div className="hrail-progress" aria-hidden="true"><motion.i style={{ scaleX: bar }} /></div></div>}
      </div>
    </div>
  );
}

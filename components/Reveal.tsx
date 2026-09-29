"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".reveal:not(.is-in), .seam:not(.is-in), .split-text:not(.is-in), .clip:not(.is-in)";

/** Adds .is-in to .reveal, .split-text, .clip and .seam elements as they scroll into view.
 *  Watches for content rendered later (filters, steps) via a MutationObserver.
 *  A fully clipped element never reports as intersecting, so .clip elements are
 *  observed through their parent. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      const all = () => document.querySelectorAll(SELECTOR).forEach((e) => e.classList.add("is-in"));
      all();
      const mo = new MutationObserver(all); mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const targets = new Map<Element, Set<Element>>(); // observed element → elements to reveal
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      targets.get(en.target)?.forEach((t) => t.classList.add("is-in"));
      targets.delete(en.target);
      io.unobserve(en.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => {
      const watch = el.classList.contains("clip") && el.parentElement ? el.parentElement : el;
      const set = targets.get(watch);
      if (set) { set.add(el); return; }
      targets.set(watch, new Set([el]));
      io.observe(watch);
    });
    scan();
    const mo = new MutationObserver(scan); mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}

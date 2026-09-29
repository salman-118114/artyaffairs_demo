"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Mobile "Order on WhatsApp" button: appears after the first screen, hides over the footer,
 *  and stays out of the way on pages that have their own sticky bar. */
const HAS_STICKY_BAR = ["/product/", "/hamper"];

export function WaFab({ href }: { href: string }) {
  const pathname = usePathname();
  const [pastTop, setPastTop] = useState(false);
  const [atFoot, setAtFoot] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastTop(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const foot = document.querySelector(".site-footer");
    const io = foot ? new IntersectionObserver(([en]) => setAtFoot(en.isIntersecting), { rootMargin: "0px 0px -35% 0px" }) : null;
    if (foot && io) io.observe(foot);
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, [pathname]);

  if (HAS_STICKY_BAR.some((p) => pathname.startsWith(p))) return null;
  return (
    <a className={`wa-fab${!pastTop || atFoot ? " is-hidden" : ""}`} href={href} target="_blank" rel="noopener">
      <Icon name="wa" className="" /><span>Order on WhatsApp</span>
    </a>
  );
}

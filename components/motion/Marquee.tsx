/**
 * Endless ticker. The track is duplicated so the loop is seamless; CSS moves it with transform.
 * Pauses on hover/focus; with reduced motion it becomes a static, wrapping line.
 */
export function Marquee({ items, speed = 40, className = "" }: { items: string[]; speed?: number; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t, i) => <li key={i}>{t}<span className="marquee-dot" aria-hidden="true">✦</span></li>)}
    </ul>
  );
  return (
    <div className={`marquee ${className}`} style={{ ["--marquee-dur" as string]: `${speed}s` }}>
      <div className="marquee-track">{row(false)}{row(true)}</div>
    </div>
  );
}

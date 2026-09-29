import type { SVGProps } from "react";

const PATHS = {
  bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  menu: <path d="M4 8h16M4 16h11" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 4.5 4.5L19 7" strokeWidth="2" />,
  arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></>,
  brush: <><path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-2.1.9H6v-3.4a3 3 0 0 1 .9-2.1L14 4Z" /><path d="M12 6l6 6" /></>,
  gift: <><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" /><path d="M12 7c-1.5-3-5-3.5-5-1.2C7 7 9 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 15 7 12 7Z" /></>,
  upload: <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  insta: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" /></>,
} as const;

export type IconName = keyof typeof PATHS | "wa" | "star" | "mark";

export function Icon({ name, className = "icon", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  if (name === "wa")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className} {...rest}>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z" />
      </svg>
    );
  if (name === "star")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className} {...rest}>
        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    );
  if (name === "mark")
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false" className={className} {...rest}>
        <circle cx="24" cy="24" r="22" /><path d="M24 40c0-8 0-14 0-20" strokeLinecap="round" />
        <path d="M24 20c-3-3-3-8 0-11 3 3 3 8 0 11Z" />
        <path d="M24 22c-4-1-7-4-7.5-8 4 .3 7 3.5 7.5 8Zm0 0c4-1 7-4 7.5-8-4 .3-7 3.5-7.5 8Z" />
        <path d="M24 32c-3.5 0-6.5-2-7.5-5.5 3.5-.4 6.5 1.8 7.5 5.5Zm0-3c3.5 0 6.5-2 7.5-5.5-3.5-.4-6.5 1.8-7.5 5.5Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false" className={className} {...rest}>
      {PATHS[name]}
    </svg>
  );
}

/** Large botanical line drawing used as decoration in dark CTA bands. */
export function Botanical({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.2" focusable="false">
        <path d="M120 236C118 190 122 150 112 110 104 78 88 52 70 30" strokeLinecap="round" />
        <path d="M114 128c-20-4-38-18-44-40 22 2 40 18 44 40Zm4-30c16-10 36-12 52-2-14 12-34 12-52 2Zm-14-30c-14-8-22-24-20-40 16 8 22 24 20 40Zm-14 76c-22 4-44-4-58-22 22-6 44 2 58 22Zm28 12c18-14 42-18 62-8-16 16-40 18-62 8Z" />
        <circle cx="68" cy="26" r="9" /><circle cx="68" cy="26" r="3.5" /><path d="M60 18c-6-6-6-12 0-16M76 18c6-6 6-12 0-16" />
        <path d="M170 96c6 4 10 10 10 18" strokeLinecap="round" /><circle cx="181" cy="118" r="4" />
      </svg>
    </div>
  );
}

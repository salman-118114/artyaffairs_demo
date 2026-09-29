import type { CSSProperties, ElementType } from "react";

/**
 * Headline that rises word by word out of a mask when it enters the viewport.
 * Pure CSS + the global <Reveal /> observer, so it renders fully visible without JS.
 * Wrap accent words in *asterisks* to set them in the italic accent face.
 */
export function SplitText({ text, as: Tag = "h2", className = "", id, delay = 0, style }: {
  text: string; as?: ElementType; className?: string; id?: string; delay?: number; style?: CSSProperties;
}) {
  const words = text.split(/\s+/);
  return (
    <Tag id={id} className={`split-text ${className}`} style={{ ...style, ["--d" as string]: `${delay}ms` }}>
      {words.map((w, i) => {
        const accent = /^\*.+\*[.,!?]?$/.test(w);
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i}>
            <span className="w"><span style={{ ["--wi" as string]: i }}>{accent ? <em>{clean}</em> : clean}</span></span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

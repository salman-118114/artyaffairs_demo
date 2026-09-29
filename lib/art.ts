import { art as drawArt, hash as hashStr, rng as makeRng, seam as drawSeam } from "./art-engine";
import type { ArtSpec } from "./types";

/** Returns an SVG string for the given artwork spec. Deterministic: same spec → same markup. */
export const artSvg = (spec: ArtSpec): string => drawArt(spec);

export const hash = (s: string): number => hashStr(s);
export const rng = (seed: number): (() => number) => makeRng(seed);

/** A full-width kintsugi seam divider (used by <Seam />). */
export function seamSvg(seed: string): string {
  const R = rng(hash(seed));
  const gid = "sg" + hash(seed).toString(36);
  const path = drawSeam(R, 0, 17, 1200, 17 + (R() - 0.5) * 8, { gid, jag: 11, steps: 16, branches: 3, width: 1.6 })
    .replace("<path ", '<path vector-effect="non-scaling-stroke" ');
  return `<svg viewBox="0 0 1200 34" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="#8A6424"/><stop offset=".3" stop-color="#E4C98F"/><stop offset=".55" stop-color="#B8893B"/><stop offset=".8" stop-color="#F1DDA8"/><stop offset="1" stop-color="#8A6424"/></linearGradient></defs>${path}</svg>`;
}

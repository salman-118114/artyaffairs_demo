// @ts-nocheck
/*
 * Artwork engine, ported unchanged from the static site (assets/js/art.js).
 * Draws on-brand SVG "product photos" until real photography is uploaded.
 * Typed entry points live in lib/art.ts; import from there.
 */

const TONES = {
  emerald: { a: "#0F4A3A", b: "#082C22", ink: "#D4AF6A", soft: "#155E49", wall: ["#F1E8D8", "#E2D3B9"] },
  ivory:   { a: "#FBF7EF", b: "#EADFC9", ink: "#0F4A3A", soft: "#DCE8E1", wall: ["#E9EFE9", "#CFDDD3"] },
  cream:   { a: "#F7F0E2", b: "#E6D8BE", ink: "#0F4A3A", soft: "#C9D8CF", wall: ["#EFE3CF", "#DCCAA8"] },
  blush:   { a: "#F5E6DD", b: "#E6CBBE", ink: "#0F4A3A", soft: "#E2B9A7", wall: ["#F4ECDD", "#E7D8BF"] },
  gold:    { a: "#F1E4C6", b: "#D9C08B", ink: "#0B3B2E", soft: "#E4C98F", wall: ["#0F4A3A", "#082C22"] }
};


export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed) {
  let a = seed || 1;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;

/* A kintsugi seam: a jagged line from (x0,y0) to (x1,y1) with a branch or two. */
export function seam(R, x0, y0, x1, y1, opts = {}) {
  const steps = opts.steps || 9;
  const jag = opts.jag || 18;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const off = i === 0 || i === steps ? 0 : (R() - 0.5) * 2 * jag;
    pts.push([x0 + dx * t + nx * off, y0 + dy * t + ny * off]);
  }
  let d = "M" + pts.map((p) => r1(p[0]) + " " + r1(p[1])).join(" L");
  const branches = opts.branches == null ? 2 : opts.branches;
  for (let b = 0; b < branches; b++) {
    const i = 2 + Math.floor(R() * (steps - 3));
    const p = pts[i];
    const ang = Math.atan2(dy, dx) + (R() > 0.5 ? 1 : -1) * (0.6 + R() * 0.6);
    const bl = len * (0.08 + R() * 0.12);
    const mid = [p[0] + Math.cos(ang) * bl * 0.5 + (R() - 0.5) * 8, p[1] + Math.sin(ang) * bl * 0.5 + (R() - 0.5) * 8];
    const end = [p[0] + Math.cos(ang) * bl, p[1] + Math.sin(ang) * bl];
    d += ` M${r1(p[0])} ${r1(p[1])} L${r1(mid[0])} ${r1(mid[1])} L${r1(end[0])} ${r1(end[1])}`;
  }
  const w = opts.width || 2.4;
  return `<path d="${d}" fill="none" stroke="url(#${opts.gid})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* A botanical sprig: a curved stem with paired leaves (line art). */
function sprig(x, y, s, rot, color, filled) {
  let leaves = "";
  for (let i = 0; i < 5; i++) {
    const t = 12 + i * 14;
    const side = i % 2 ? 1 : -1;
    leaves += `<ellipse cx="${side * 7}" cy="${-t}" rx="4.2" ry="9" transform="rotate(${side * 38} ${side * 7} ${-t})" ${filled ? `fill="${color}" fill-opacity=".85"` : `fill="none" stroke="${color}" stroke-width="1.3"`}/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C 2 -30, -3 -55, 3 -86" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>${leaves}<circle cx="3" cy="-90" r="3.2" fill="${color}"/></g>`;
}

function goldDefs(gid) {
  return `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8A6424"/><stop offset=".35" stop-color="#E4C98F"/>
    <stop offset=".6" stop-color="#B8893B"/><stop offset=".85" stop-color="#F1DDA8"/><stop offset="1" stop-color="#8A6424"/></linearGradient>`;
}

function wall(T, id) {
  return `<linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.wall[0]}"/><stop offset="1" stop-color="${T.wall[1]}"/></linearGradient>
    <radialGradient id="l${id}" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
}
const wallRect = (id) => `<rect width="400" height="500" fill="url(#w${id})"/><rect width="400" height="500" fill="url(#l${id})"/>`;
const shadow = (x, y, w, h, rx = 2) => `<rect x="${x + 6}" y="${y + 12}" width="${w}" height="${h}" rx="${rx}" fill="#2B2A27" opacity=".16" filter="url(#blur)"/>`;
const blurDef = `<filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>`;

const DRAW = {
  calligraphy(T, R, id, g, o) {
    const text = o.text || "بسم الله";
    return {
      defs: wall(T, id) + `<linearGradient id="c${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#155E49"/><stop offset="1" stop-color="#082C22"/></linearGradient>`,
      body: wallRect(id) + shadow(80, 70, 240, 320) +
        `<rect x="80" y="70" width="240" height="320" rx="2" fill="url(#c${id})"/>
         <rect x="96" y="86" width="208" height="288" fill="none" stroke="url(#${g})" stroke-width="1.2" opacity=".85"/>
         <text x="200" y="244" text-anchor="middle" font-size="${text.length > 10 ? 38 : 56}" fill="url(#${g})" style="font-family:var(--font-arabic)">${text}</text>
         <g fill="url(#${g})"><circle cx="200" cy="150" r="3"/><circle cx="188" cy="156" r="1.6"/><circle cx="212" cy="156" r="1.6"/><circle cx="200" cy="310" r="3"/></g>` +
        `<clipPath id="k${id}"><rect x="80" y="70" width="240" height="320"/></clipPath><g clip-path="url(#k${id})">${seam(R, 80, 120 + R() * 60, 320, 300 + R() * 60, { gid: g, jag: 14 })}</g>`
    };
  },
  roundel(T, R, id, g, o) {
    const text = (o.text || "الله لا إله إلا هو") + " ۝ ";
    return {
      defs: wall(TONES.emerald, id),
      body: wallRect(id) + `<circle cx="206" cy="262" r="150" fill="#2B2A27" opacity=".18" filter="url(#blur)"/>
        <circle cx="200" cy="250" r="150" fill="${T.a}"/><circle cx="200" cy="250" r="146" fill="none" stroke="url(#${g})" stroke-width="5"/>
        <circle cx="200" cy="250" r="128" fill="none" stroke="url(#${g})" stroke-width="1"/>
        <path id="p${id}" d="M200 250 m-108 0 a108 108 0 1 1 216 0 a108 108 0 1 1 -216 0" fill="none"/>
        <text font-size="23" fill="#0F4A3A" style="font-family:var(--font-arabic)"><textPath href="#p${id}">${text.repeat(3)}</textPath></text>
        <circle cx="200" cy="250" r="72" fill="none" stroke="url(#${g})" stroke-width="1"/>
        <g transform="translate(200 250)" fill="url(#${g})"><rect x="-26" y="-26" width="52" height="52"/><rect x="-26" y="-26" width="52" height="52" transform="rotate(45)"/></g>
        <g transform="translate(200 250)"><circle r="14" fill="#0F4A3A"/></g>` +
        `<clipPath id="k${id}"><circle cx="200" cy="250" r="150"/></clipPath><g clip-path="url(#k${id})">${seam(R, 50, 170, 350, 330, { gid: g, jag: 20, width: 3 })}</g>`
    };
  },
  name(T, R, id, g, o) {
    const name = o.text || "Zoya";
    const ar = o.arabic || "زويا";
    return {
      defs: wall(TONES.ivory, id),
      body: wallRect(id) + shadow(75, 70, 250, 330) +
        `<rect x="75" y="70" width="250" height="330" fill="#FBF7EF"/><rect x="75" y="70" width="250" height="330" fill="none" stroke="url(#${g})" stroke-width="7"/>
         ${sprig(112, 380, 1.1, -18, "#155E49", true)}${sprig(288, 380, 1.1, 18, "#155E49", true)}${sprig(118, 110, .7, 160, "#B8893B", false)}${sprig(282, 110, .7, -160, "#B8893B", false)}
         <text x="200" y="215" text-anchor="middle" font-size="58" fill="#0F4A3A" style="font-family:var(--font-arabic)">${ar}</text>
         <text x="200" y="285" text-anchor="middle" font-size="44" font-style="italic" fill="#2B2A27" style="font-family:var(--font-display)">${name}</text>
         <line x1="170" y1="305" x2="230" y2="305" stroke="url(#${g})" stroke-width="1.5"/>`
    };
  },
  abstract(T, R, id, g) {
    let blobs = "";
    const cols = ["#155E49", "#0F4A3A", "#C9D8CF", "#F4ECDD", "#0B3B2E", "#8FB3A0"];
    for (let i = 0; i < 9; i++) {
      const cx = 60 + R() * 280, cy = 60 + R() * 380, rx = 50 + R() * 110, ry = 30 + R() * 80;
      blobs += `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" transform="rotate(${r1(R() * 180)} ${r1(cx)} ${r1(cy)})" fill="${cols[i % cols.length]}" opacity="${r1(0.55 + R() * 0.4)}"/>`;
    }
    return {
      defs: wall(TONES.cream, id) + `<filter id="soft${id}"><feGaussianBlur stdDeviation="14"/></filter>`,
      body: wallRect(id) + shadow(60, 45, 280, 400) +
        `<clipPath id="k${id}"><rect x="60" y="45" width="280" height="400"/></clipPath><g clip-path="url(#k${id})"><rect x="60" y="45" width="280" height="400" fill="#0F4A3A"/>
        <g filter="url(#soft${id})">${blobs}</g>
        ${seam(R, 60, 110, 340, 250, { gid: g, jag: 16, width: 3 })}${seam(R, 150, 45, 230, 445, { gid: g, jag: 22, width: 2.2 })}${seam(R, 60, 380, 340, 330, { gid: g, jag: 12, width: 1.6, branches: 1 })}
        ${sprig(300, 440, 1.3, -10, "#E4C98F", false)}</g>`
    };
  },
  resin(T, R, id, g) {
    const deep = T === TONES.gold ? ["#FBF7EF", "#EADFC9", "#D4AF6A"] : T === TONES.ivory ? ["#FBF7EF", "#E6DCC8", "#C9D8CF"] : ["#1E8068", "#0F4A3A", "#082C22"];
    let lace = "";
    for (let i = 0; i < 5; i++) {
      const rr = 60 + i * 20 + R() * 10;
      let d = "";
      for (let a = 0; a <= 24; a++) {
        const ang = (a / 24) * Math.PI * 2;
        const rad = rr + Math.sin(ang * (3 + i) + R()) * 6 + R() * 5;
        d += (a ? "L" : "M") + r1(200 + Math.cos(ang) * rad * 1.15) + " " + r1(262 + Math.sin(ang) * rad * 0.8);
      }
      lace += `<path d="${d}Z" fill="none" stroke="#fff" stroke-opacity="${r1(0.25 + R() * 0.4)}" stroke-width="${r1(1 + R() * 2.5)}"/>`;
    }
    let flecks = "";
    for (let i = 0; i < 26; i++) {
      const ang = R() * Math.PI * 2, rad = 40 + R() * 110;
      flecks += `<circle cx="${r1(200 + Math.cos(ang) * rad * 1.15)}" cy="${r1(262 + Math.sin(ang) * rad * 0.8)}" r="${r1(0.6 + R() * 1.8)}" fill="url(#${g})"/>`;
    }
    return {
      defs: `<linearGradient id="t${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDE3D0"/><stop offset="1" stop-color="#D8C8AA"/></linearGradient>
        <radialGradient id="r${id}" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="${deep[0]}"/><stop offset=".55" stop-color="${deep[1]}"/><stop offset="1" stop-color="${deep[2]}"/></radialGradient>`,
      body: `<rect width="400" height="500" fill="url(#t${id})"/><ellipse cx="208" cy="282" rx="178" ry="126" fill="#2B2A27" opacity=".2" filter="url(#blur)"/>
        <ellipse cx="200" cy="262" rx="178" ry="126" fill="url(#r${id})"/>${lace}${flecks}
        <clipPath id="k${id}"><ellipse cx="200" cy="262" rx="178" ry="126"/></clipPath><g clip-path="url(#k${id})">${seam(R, 30, 230, 370, 300, { gid: g, jag: 14, width: 2.6 })}</g>
        <ellipse cx="200" cy="262" rx="178" ry="126" fill="none" stroke="url(#${g})" stroke-width="6"/>
        <ellipse cx="160" cy="205" rx="70" ry="22" fill="#fff" opacity=".12" transform="rotate(-12 160 205)"/>`
    };
  },
  coasters(T, R, id, g) {
    let c = "";
    [[130, 190], [270, 190], [130, 330], [270, 330]].forEach(([x, y], i) => {
      c += `<circle cx="${x + 4}" cy="${y + 8}" r="62" fill="#2B2A27" opacity=".18" filter="url(#blur)"/><circle cx="${x}" cy="${y}" r="62" fill="url(#r${id})"/>
        <clipPath id="k${id}${i}"><circle cx="${x}" cy="${y}" r="62"/></clipPath><g clip-path="url(#k${id}${i})">${seam(R, x - 70, y - 20 + R() * 40, x + 70, y - 20 + R() * 40, { gid: g, jag: 10, steps: 6, branches: 1 })}</g>
        <circle cx="${x}" cy="${y}" r="62" fill="none" stroke="url(#${g})" stroke-width="3"/>`;
    });
    return {
      defs: `<radialGradient id="r${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#E8DECB"/></radialGradient>`,
      body: `<rect width="400" height="500" fill="#0F4A3A"/><rect width="400" height="500" fill="#082C22" opacity=".4"/>${c}`
    };
  },
  pen(T, R, id, g, o) {
    const barrel = T === TONES.ivory ? "#FBF7EF" : "#0F4A3A";
    const bg = T === TONES.ivory ? ["#0F4A3A", "#082C22"] : ["#F4ECDD", "#E6D8BE"];
    const txt = T === TONES.ivory ? "#FBF7EF" : "#0F4A3A";
    let flowers = "";
    for (let i = 0; i < 7; i++) {
      const x = -140 + i * 30 + R() * 10;
      flowers += `<g transform="translate(${r1(x)} ${r1((R() - 0.5) * 10)})"><circle r="3.2" fill="#D4AF6A"/><circle cx="4" cy="-3" r="2" fill="${T === TONES.ivory ? "#155E49" : "#F4ECDD"}"/><ellipse cx="-6" cy="3" rx="4" ry="1.6" fill="${T === TONES.ivory ? "#155E49" : "#C9D8CF"}" transform="rotate(-20)"/></g>`;
    }
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
        <linearGradient id="br${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        ${sprig(34, 500, 1.05, 28, "#B8893B", false)}${sprig(366, 470, 1.05, -28, "#B8893B", false)}${sprig(350, 60, 0.9, 200, "#B8893B", false)}
        <g transform="translate(200 220) rotate(-32)">
          <rect x="-150" y="-12" width="300" height="24" rx="12" fill="#2B2A27" opacity=".25" filter="url(#blur)" transform="translate(6 14)"/>
          <path d="M150 -12 L200 0 L150 12 Z" fill="url(#${g})"/><line x1="160" y1="0" x2="196" y2="0" stroke="#5c421a" stroke-width="1"/>
          <rect x="-150" y="-12" width="300" height="24" rx="12" fill="${barrel}"/>
          <rect x="110" y="-13" width="14" height="26" fill="url(#${g})"/><rect x="-150" y="-12" width="22" height="24" rx="10" fill="url(#${g})"/>
          ${flowers}
          <rect x="-150" y="-12" width="300" height="24" rx="12" fill="url(#br${id})"/>
        </g>
        <text x="200" y="400" text-anchor="middle" font-size="30" font-style="italic" fill="${txt}" style="font-family:var(--font-display)">${o.text || "Ayesha &amp; Imran"}</text>
        <line x1="165" y1="420" x2="235" y2="420" stroke="url(#${g})" stroke-width="1.5"/>`
    };
  },
  hamper(T, R, id, g) {
    const box = { emerald: "#0F4A3A", cream: "#E9DDC6", blush: "#E7C9BA", gold: "#155E49", ivory: "#F4ECDD" }[Object.keys(TONES).find((k) => TONES[k] === T)] || "#0F4A3A";
    const lid = box === "#0F4A3A" ? "#155E49" : box === "#155E49" ? "#1E6E56" : "#F4ECDD";
    const bg = box === "#0F4A3A" || box === "#155E49" ? ["#F4ECDD", "#E4D5BA"] : ["#DCE8E1", "#BFD2C6"];
    let blooms = "";
    for (let i = 0; i < 6; i++) {
      const x = 130 + R() * 150, y = 200 - R() * 60, r = 11 + R() * 10;
      const col = ["#F4ECDD", "#E2B9A7", "#FBF7EF", "#D4AF6A"][i % 4];
      blooms += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${col}"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.45)}" fill="none" stroke="#2B2A27" stroke-opacity=".15"/>`;
    }
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        ${sprig(120, 215, 1.2, -30, "#155E49", true)}${sprig(290, 210, 1.1, 28, "#155E49", true)}${sprig(200, 205, 1.3, 4, "#8FB3A0", true)}
        ${blooms}
        <rect x="235" y="150" width="70" height="92" rx="2" fill="#FBF7EF" transform="rotate(10 270 196)"/><text x="270" y="200" text-anchor="middle" font-size="18" fill="#0F4A3A" transform="rotate(10 270 196)" style="font-family:var(--font-arabic)">مبروك</text>
        <rect x="120" y="170" width="18" height="80" rx="9" fill="#FBF7EF" transform="rotate(-14 129 210)"/><rect x="120" y="190" width="18" height="6" fill="url(#${g})" transform="rotate(-14 129 210)"/>
        <ellipse cx="206" cy="428" rx="150" ry="20" fill="#2B2A27" opacity=".22" filter="url(#blur)"/>
        <rect x="70" y="236" width="260" height="190" rx="3" fill="${box}"/>
        <rect x="62" y="226" width="276" height="30" rx="3" fill="${lid}"/>
        <rect x="188" y="226" width="24" height="200" fill="url(#${g})"/>
        <text x="200" y="352" text-anchor="middle" font-size="22" font-style="italic" fill="${box === "#0F4A3A" || box === "#155E49" ? "#D4AF6A" : "#0F4A3A"}" style="font-family:var(--font-display)" opacity=".0">.</text>
        <path d="M200 240 C 170 205, 140 215, 150 238 C 160 256, 190 248, 200 240 Z" fill="url(#${g})"/>
        <path d="M200 240 C 230 205, 260 215, 250 238 C 240 256, 210 248, 200 240 Z" fill="url(#${g})"/>
        <circle cx="200" cy="240" r="8" fill="#8A6424"/>
        <clipPath id="k${id}"><rect x="70" y="256" width="260" height="170"/></clipPath><g clip-path="url(#k${id})" opacity=".9">${seam(R, 70, 330, 188, 300, { gid: g, jag: 10, steps: 6, branches: 1, width: 1.8 })}${seam(R, 212, 360, 330, 390, { gid: g, jag: 10, steps: 6, branches: 1, width: 1.8 })}</g>`
    };
  },
  diary(T, R, id, g, o) {
    const cover = T === TONES.ivory ? "#F4ECDD" : "#0F4A3A";
    const ink = T === TONES.ivory ? "#0F4A3A" : "#D4AF6A";
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${T === TONES.ivory ? "#0F4A3A" : "#EFE3CF"}"/><stop offset="1" stop-color="${T === TONES.ivory ? "#082C22" : "#D9C6A4"}"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        <g transform="rotate(-6 200 250)">
          <rect x="104" y="92" width="210" height="300" rx="6" fill="#2B2A27" opacity=".28" filter="url(#blur)"/>
          <rect x="106" y="86" width="200" height="296" rx="4" fill="#FBF7EF"/>
          <rect x="96" y="80" width="204" height="300" rx="6" fill="${cover}"/>
          <rect x="96" y="80" width="16" height="300" rx="4" fill="#000" opacity=".12"/>
          <rect x="270" y="80" width="8" height="300" fill="${T === TONES.ivory ? "#155E49" : "#082C22"}"/>
          <rect x="126" y="112" width="148" height="236" fill="none" stroke="url(#${g})" stroke-width="1"/>
          ${sprig(200, 260, 0.9, 0, ink, false)}
          <text x="200" y="300" text-anchor="middle" font-size="${(o.text || "").length > 6 ? 20 : 30}" fill="url(#${g})" style="font-family:var(--font-display)" letter-spacing="3">${o.text || "S.K."}</text>
        </g>`
    };
  },
  letter(T, R, id, g) {
    let lines = "";
    for (let i = 0; i < 9; i++) {
      let d = `M130 ${150 + i * 22}`;
      const w = 150 - (i === 8 ? 80 : R() * 30);
      for (let x = 0; x < w; x += 10) d += ` q 3 ${r1(-5 - R() * 4)} 6 0 t ${r1(3 + R() * 2)} 0`;
      lines += `<path d="${d}" fill="none" stroke="#2B3F5C" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>`;
    }
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F4A3A"/><stop offset="1" stop-color="#082C22"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        <g transform="rotate(8 250 360)"><rect x="160" y="300" width="210" height="140" rx="3" fill="#E6D8BE"/><path d="M160 300 L265 380 L370 300" fill="none" stroke="#C9B48E" stroke-width="2"/></g>
        <g transform="rotate(-5 200 240)"><rect x="112" y="110" width="200" height="270" fill="#2B2A27" opacity=".3" filter="url(#blur)"/>
        <rect x="106" y="100" width="200" height="270" fill="#FBF7EF"/>
        <text x="130" y="135" font-size="17" font-style="italic" fill="#2B3F5C" style="font-family:var(--font-display)">My dearest,</text>${lines}</g>
        <circle cx="292" cy="372" r="30" fill="#8A6424"/><circle cx="292" cy="372" r="30" fill="url(#${g})" opacity=".85"/>
        <circle cx="292" cy="372" r="21" fill="none" stroke="#8A6424" stroke-width="1.5"/>${sprig(292, 386, .28, 0, "#8A6424", true)}`
    };
  },
  bouquet(T, R, id, g) {
    let stems = "", heads = "";
    for (let i = 0; i < 11; i++) {
      const tx = 120 + R() * 160, ty = 90 + R() * 110;
      stems += `<path d="M200 330 Q ${r1((tx + 200) / 2 + (R() - 0.5) * 30)} ${r1((ty + 330) / 2)} ${r1(tx)} ${r1(ty)}" fill="none" stroke="#6F8B6E" stroke-width="1.6"/>`;
      const k = i % 3;
      if (k === 0) heads += `<ellipse cx="${r1(tx)}" cy="${r1(ty)}" rx="8" ry="15" fill="#F7F0E2" transform="rotate(${r1((R() - 0.5) * 40)} ${r1(tx)} ${r1(ty)})"/>`;
      else if (k === 1) heads += `<circle cx="${r1(tx)}" cy="${r1(ty)}" r="${r1(12 + R() * 6)}" fill="#E2B9A7"/><circle cx="${r1(tx)}" cy="${r1(ty)}" r="5" fill="none" stroke="#B9806C" stroke-width="1.5"/>`;
      else heads += `<path d="M${r1(tx)} ${r1(ty)} q -14 -30 -4 -60 q 10 30 4 60" fill="#E4C98F" opacity=".9"/>`;
    }
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE8E1"/><stop offset="1" stop-color="#C3D5CA"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>${stems}${heads}
        ${sprig(150, 260, 1.2, -35, "#155E49", true)}${sprig(255, 260, 1.2, 35, "#155E49", true)}
        <path d="M120 240 L200 470 L280 240 Q 200 270 120 240 Z" fill="#F4ECDD"/><path d="M120 240 L200 470 L170 250 Z" fill="#E6D8BE"/>
        <path d="M170 355 C 150 330, 130 350, 150 365 M230 355 C 250 330, 270 350, 250 365" fill="none" stroke="url(#${g})" stroke-width="5" stroke-linecap="round"/>
        <path d="M160 358 L240 358" stroke="url(#${g})" stroke-width="7"/><path d="M200 360 L185 420 M200 360 L214 418" stroke="url(#${g})" stroke-width="3"/>`
    };
  },
  card(T, R, id, g) {
    let wash = "";
    for (let i = 0; i < 5; i++) wash += `<circle cx="${r1(160 + R() * 110)}" cy="${r1(190 + R() * 120)}" r="${r1(30 + R() * 40)}" fill="${["#C9D8CF", "#E2B9A7", "#8FB3A0", "#F1DDA8"][i % 4]}" opacity=".55"/>`;
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE3CF"/><stop offset="1" stop-color="#DCCAA8"/></linearGradient><filter id="wc${id}"><feGaussianBlur stdDeviation="6"/></filter>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        <path d="M110 110 L250 90 L250 400 L110 420 Z" fill="#E9DFCD"/>
        <rect x="140" y="100" width="190" height="300" fill="#2B2A27" opacity=".2" filter="url(#blur)" transform="translate(4 8)"/>
        <rect x="140" y="100" width="190" height="300" fill="#FBF7EF"/>
        <clipPath id="k${id}"><rect x="140" y="100" width="190" height="300"/></clipPath><g clip-path="url(#k${id})"><g filter="url(#wc${id})">${wash}</g>${sprig(235, 330, 1.1, -8, "#155E49", false)}</g>
        <text x="235" y="370" text-anchor="middle" font-size="22" font-style="italic" fill="#0F4A3A" style="font-family:var(--font-display)">for you</text>`
    };
  },
  kintsugi(T, R, id, g) {
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F4A3A"/><stop offset="1" stop-color="#082C22"/></linearGradient>
        <radialGradient id="bw${id}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#D9CDB6"/></radialGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>
        <ellipse cx="206" cy="372" rx="140" ry="22" fill="#000" opacity=".35" filter="url(#blur)"/>
        <clipPath id="k${id}"><path d="M60 230 Q 60 370 200 372 Q 340 370 340 230 Z"/></clipPath>
        <path d="M60 230 Q 60 370 200 372 Q 340 370 340 230 Z" fill="url(#bw${id})"/>
        <ellipse cx="200" cy="230" rx="140" ry="30" fill="#EADFC9"/><ellipse cx="200" cy="232" rx="126" ry="23" fill="#D9CDB6"/>
        <g clip-path="url(#k${id})">${seam(R, 70, 250, 330, 330, { gid: g, jag: 16, width: 3 })}${seam(R, 150, 230, 210, 372, { gid: g, jag: 12, width: 2.4, branches: 1 })}${seam(R, 250, 230, 320, 320, { gid: g, jag: 10, width: 2, branches: 1 })}</g>
        <path d="M60 230 Q 80 212 200 200" fill="none" stroke="url(#${g})" stroke-width="2"/>`
    };
  },
  diya(T, R, id, g) {
    let d = "";
    [[120, 300], [200, 330], [280, 300]].forEach(([x, y]) => {
      d += `<ellipse cx="${x}" cy="${y - 44}" rx="10" ry="22" fill="#F1DDA8" opacity=".35" filter="url(#blur)"/>
        <path d="M${x} ${y - 58} q 9 22 0 30 q -9 -8 0 -30" fill="#F1B84B"/><path d="M${x} ${y - 46} q 4 10 0 16 q -4 -6 0 -16" fill="#FFF3D0"/>
        <path d="M${x - 46} ${y - 22} Q ${x} ${y + 30} ${x + 46} ${y - 22} Q ${x + 30} ${y - 26} ${x + 18} ${y - 28} L ${x} ${y - 30} L ${x - 18} ${y - 28} Q ${x - 30} ${y - 26} ${x - 46} ${y - 22} Z" fill="#A4533A"/>
        <path d="M${x - 40} ${y - 18} Q ${x} ${y + 18} ${x + 40} ${y - 18}" fill="none" stroke="url(#${g})" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/>`;
    });
    return {
      defs: `<linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B3B2E"/><stop offset="1" stop-color="#082C22"/></linearGradient>`,
      body: `<rect width="400" height="500" fill="url(#b${id})"/>${d}${sprig(60, 470, 1.2, 25, "#B8893B", false)}${sprig(340, 470, 1.2, -25, "#B8893B", false)}`
    };
  }
};

/**
 * Returns an SVG string.
 * spec: { type, tone, text, arabic, seed, label }
 */
export function art(spec) {
  const type = DRAW[spec.type] ? spec.type : "abstract";
  const T = TONES[spec.tone] || TONES.emerald;
  const R = rng(hash(String(spec.seed || spec.type + (spec.tone || ""))));
  const id = "a" + hash(JSON.stringify([spec.type, spec.tone, spec.text, spec.arabic, spec.seed, spec.label])).toString(36);
  const g = "g" + id;
  const out = DRAW[type](T, R, id, g, spec);
  const label = spec.label ? `role="img" aria-label="${spec.label.replace(/"/g, "&quot;")}"` : `aria-hidden="true"`;
  const svg = `<svg class="art-svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" ${label} focusable="false"><defs>${goldDefs(g)}${blurDef}${out.defs}</defs>${out.body}</svg>`;
  return svg.replace(/id="blur"/, `id="blur${id}"`).replace(/url\(#blur\)/g, `url(#blur${id})`);
}


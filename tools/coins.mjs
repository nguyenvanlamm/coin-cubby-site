// Writes the SVG sprite of the game's art (coins 1–12, their reeded edges, the
// star coin, the face-down coin, stone, clover, padlock) into every page that has
// the markers <!-- sprite:start --> … <!-- sprite:end -->.
//
//   node tools/coins.mjs
//
// Colours are copied from the game (lib/ui/theme.dart, _coinColors), so a coin
// on the site matches the coin in the app. Each coin carries the game's value
// notch at value × 30° (coin 3 points right, coin 12 points up).
import { readFileSync, writeFileSync } from 'node:fs';

// body, rim light, rim dark, face high, face low, reed, numeral, light face
const COINS = [
  ['copper', '#9B582F', '#CDA691', '#532C15', '#B98569', '#764121', '#66381C', '#FFFAF2', false],
  ['silver', '#C7CFD7', '#E1E6EA', '#6C7075', '#D6DCE2', '#989EA5', '#84898F', '#1A2026', true],
  ['gold', '#F8C73E', '#FCE3A7', '#886C1E', '#FAD782', '#BE982E', '#A68426', '#362207', true],
  ['blue', '#2666CF', '#8EB1EA', '#103470', '#6492DF', '#1B4C9E', '#164289', '#FFFFFF', false],
  ['green', '#50C45A', '#ABE2AB', '#286A2D', '#88D68B', '#3B9643', '#328239', '#09200B', true],
  ['purple', '#983CC6', '#C99EE5', '#511C6B', '#B578D9', '#732C97', '#642583', '#FFFFFF', false],
  ['pink', '#FD89B9', '#FFC3DA', '#8B4864', '#FFABCC', '#C2688D', '#A95A7B', '#341121', true],
  ['teal', '#29BBBB', '#A1DCDB', '#126565', '#79CECE', '#1D8F8F', '#187C7C', '#001C1E', true],
  ['red', '#CD2023', '#EE978D', '#6F0C0E', '#E26D63', '#9D1618', '#881213', '#FFFFFF', false],
  ['onyx', '#322C28', '#E1DDD8', '#7E7974', '#66615D', '#24201C', '#1E1A16', '#FFFFFF', false],
  ['orange', '#FA8F19', '#FFC799', '#894C09', '#FEB16F', '#C06D11', '#A75E0D', '#351502', true],
  ['sky', '#93DCFF', '#C9EDFF', '#4E788E', '#B3E6FF', '#70A9C6', '#6093AD', '#02243C', true],
];
const HIDDEN = ['hidden', '#6E6964', '#B2ADA7', '#3D3935', '#8E8984', '#55504B', '#47433F', '#F3EEE6', false];

const r2 = (n) => Math.round(n * 100) / 100;

function gradients(id, c) {
  const [, body, light, dark, hi, lo] = c;
  return (
    `<linearGradient id="rim${id}" x1="0.15" y1="0.05" x2="0.85" y2="0.95">` +
    `<stop offset="0" stop-color="${light}"/><stop offset="0.5" stop-color="${body}"/><stop offset="1" stop-color="${dark}"/></linearGradient>` +
    `<radialGradient id="face${id}" cx="0.36" cy="0.3" r="0.8">` +
    `<stop offset="0" stop-color="${hi}"/><stop offset="0.55" stop-color="${body}"/><stop offset="1" stop-color="${lo}"/></radialGradient>`
  );
}

// The face of a coin; `label` is its numeral (or "?").
function face(id, c, label, notchDeg) {
  const [, , , dark, , , num, lightFace] = c;
  const edge = lightFace ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.5)';
  const two = label.length > 1;
  const family = two ? 'MartianMonoCondensed, Martian Mono, monospace' : 'Martian Mono, monospace';
  const size = two ? 36 : 40;
  const notch =
    notchDeg == null
      ? ''
      : `<rect x="47.2" y="3" width="5.6" height="9" rx="2.8" fill="${dark}" fill-opacity=".9" transform="rotate(${notchDeg} 50 50)"/>`;
  return (
    `<circle cx="50" cy="50" r="48" fill="url(#rim${id})"/>` +
    `<circle cx="50" cy="50" r="48" fill="none" stroke="${dark}" stroke-opacity=".7" stroke-width="1.5"/>` +
    notch +
    `<circle cx="50" cy="50" r="37.5" fill="url(#face${id})"/>` +
    `<circle cx="50" cy="50" r="37.5" fill="none" stroke="${dark}" stroke-opacity=".45" stroke-width="1.4"/>` +
    `<circle cx="50" cy="50" r="32.5" fill="none" stroke="${dark}" stroke-opacity=".38" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0 ${r2((2 * Math.PI * 32.5) / 36)}"/>` +
    `<g font-family="${family}" font-weight="800" font-size="${size}" text-anchor="middle">` +
    `<text x="50" y="${two ? 63.5 : 64.5}" fill="${edge}">${label}</text>` +
    `<text x="50" y="${two ? 62 : 63}" fill="${num}">${label}</text></g>`
  );
}

// A coin behind the front one: only its reeded rim shows above the next coin.
function edge(id, c) {
  const [, , , dark, , , reed] = c;
  return (
    `<circle cx="50" cy="50" r="48" fill="url(#rim${id})"/>` +
    `<circle cx="50" cy="50" r="44" fill="none" stroke="${reed}" stroke-width="7" stroke-dasharray="1.5 1.6"/>` +
    `<circle cx="50" cy="50" r="48" fill="none" stroke="${dark}" stroke-opacity=".8" stroke-width="1.5"/>`
  );
}

// The star coin: a rim of all twelve colours, each at its own hour, round a
// warm-white face with a dark star.
function star() {
  let segs = '';
  for (let v = 1; v <= 12; v++) {
    const a0 = ((v * 30 - 15 - 90) * Math.PI) / 180;
    const a1 = ((v * 30 + 15 - 90) * Math.PI) / 180;
    const p = (a, r) => `${r2(50 + r * Math.cos(a))} ${r2(50 + r * Math.sin(a))}`;
    segs += `<path d="M${p(a0, 48)} A48 48 0 0 1 ${p(a1, 48)} L${p(a1, 37)} A37 37 0 0 0 ${p(a0, 37)} Z" fill="${COINS[v - 1][1]}"/>`;
  }
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((i * 36 - 90) * Math.PI) / 180;
    const r = i % 2 ? 9.5 : 22;
    pts.push(`${r2(50 + r * Math.cos(a))},${r2(50 + 1.5 + r * Math.sin(a))}`);
  }
  return (
    segs +
    `<circle cx="50" cy="50" r="48" fill="none" stroke="#151210" stroke-opacity=".55" stroke-width="1.5"/>` +
    `<circle cx="50" cy="50" r="37" fill="#F3EEE6"/>` +
    `<circle cx="50" cy="50" r="37" fill="none" stroke="#151210" stroke-opacity=".35" stroke-width="1.4"/>` +
    `<polygon points="${pts.join(' ')}" fill="#211C18" stroke="#211C18" stroke-width="2" stroke-linejoin="round"/>`
  );
}

const STONE =
  '<polygon points="14,70 22,40 44,26 70,30 88,52 84,76 60,86 30,84" fill="#5A544E"/>' +
  '<polygon points="22,40 44,26 52,48 30,58" fill="#8D867E"/>' +
  '<polygon points="44,26 70,30 66,50 52,48" fill="#A39C93"/>' +
  '<polygon points="70,30 88,52 66,50" fill="#7A736C"/>' +
  '<polygon points="30,58 52,48 66,50 60,86 30,84" fill="#68625C"/>' +
  '<polygon points="66,50 88,52 84,76 60,86" fill="#4A4540"/>' +
  '<polygon points="14,70 22,40 30,58 30,84" fill="#4F4A45"/>';

const CLOVER =
  '<g fill="#89E29D"><circle cx="38" cy="36" r="15"/><circle cx="62" cy="36" r="15"/><circle cx="38" cy="60" r="15"/><circle cx="62" cy="60" r="15"/></g>' +
  '<path d="M50 50 C 55 66, 58 78, 70 90" fill="none" stroke="#89E29D" stroke-width="6" stroke-linecap="round"/>' +
  '<g fill="#151210" fill-opacity=".28"><circle cx="50" cy="48" r="5"/></g>';

const PADLOCK =
  '<path d="M34 46 V34 a16 16 0 0 1 32 0 V46" fill="none" stroke="#D5D0C8" stroke-width="8"/>' +
  '<rect x="24" y="44" width="52" height="42" rx="7" fill="#D5D0C8"/>' +
  '<circle cx="50" cy="61" r="6" fill="#25211D"/><rect x="47" y="62" width="6" height="13" rx="3" fill="#25211D"/>';

function sprite() {
  let defs = '';
  let syms = '';
  COINS.forEach((c, i) => {
    const v = i + 1;
    defs += gradients(v, c);
    syms += `<symbol id="c${v}" viewBox="0 0 100 100">${face(v, c, String(v), v * 30)}</symbol>`;
    syms += `<symbol id="e${v}" viewBox="0 0 100 100">${edge(v, c)}</symbol>`;
  });
  defs += gradients('h', HIDDEN);
  syms += `<symbol id="ch" viewBox="0 0 100 100">${face('h', HIDDEN, '?', null)}</symbol>`;
  syms += `<symbol id="cstar" viewBox="0 0 100 100">${star()}</symbol>`;
  syms += `<symbol id="stone" viewBox="0 0 100 100">${STONE}</symbol>`;
  syms += `<symbol id="clover" viewBox="0 0 100 100">${CLOVER}</symbol>`;
  syms += `<symbol id="lock" viewBox="0 0 100 100">${PADLOCK}</symbol>`;
  return (
    '<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">' +
    `<defs>${defs}</defs>${syms}</svg>`
  );
}

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', '404.html'];
const svg = sprite();
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const out = html.replace(
    /<!-- sprite:start -->[\s\S]*?<!-- sprite:end -->/,
    `<!-- sprite:start -->\n${svg}\n<!-- sprite:end -->`,
  );
  if (out === html && !html.includes(svg)) throw new Error(`${page}: no sprite markers`);
  writeFileSync(page, out);
  console.log(`${page}: sprite ${svg.length} bytes`);
}

// The hero's four-pocket tray: the game's rules in miniature. Tap a pocket to
// lift the same-number coins at its front, tap an empty or matching pocket to
// drop them (a pocket holds ten), ten of a kind merge into five of the next
// number, and Deal! drops new piles into empty pockets.
(() => {
  const tray = document.getElementById('d-tray');
  if (!tray) return;

  const COLORS = ['#9B582F', '#C7CFD7', '#F8C73E', '#2666CF', '#50C45A', '#983CC6', '#FD89B9', '#29BBBB', '#CD2023', '#E1DDD8', '#FA8F19', '#93DCFF'];
  const NAMES = ['copper', 'silver', 'gold', 'blue', 'green', 'purple', 'pink', 'teal', 'red', 'onyx', 'orange', 'sky'];
  const CAP = 10;
  const OUT = 5;
  const TOP = 12;
  const START = [[3, 3, 3, 3], [3, 3, 3, 3, 3, 3], [2, 2, 2], []];
  const HELLO = 'Tap the four gold 3s, then tap the pocket with six.';

  const text = document.getElementById('d-text');
  const deal = document.getElementById('d-deal');
  const reset = document.getElementById('d-reset');
  const next = document.querySelector('#d-next use');
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  let pockets, sel, best, busy;
  let arrived = new Map(); // pocket -> how many coins just landed at its front
  let popped = -1; // pocket that just merged

  const front = (p) => p[p.length - 1];
  const group = (p) => {
    let n = 0;
    while (n < p.length && p[p.length - 1 - n] === front(p)) n++;
    return n;
  };
  const fits = (from, to) => from !== to && pockets[from].length > 0 && pockets[to].length < CAP && (pockets[to].length === 0 || front(pockets[to]) === front(pockets[from]));
  const name = (v, n) => `${NAMES[v - 1]} ${v}${n === 1 ? '' : 's'}`;
  const anyMove = () => pockets.some((_, a) => pockets.some((__, b) => fits(a, b) && !(pockets[b].length === 0 && group(pockets[a]) === pockets[a].length)));
  const empties = () => pockets.map((p, i) => (p.length ? -1 : i)).filter((i) => i >= 0);

  function say(s) {
    text.textContent = s;
  }

  function start() {
    pockets = START.map((p) => p.slice());
    sel = null;
    busy = false;
    best = 3;
    arrived = new Map();
    popped = -1;
    render();
    say(HELLO);
  }

  function coinSvg(v, k, cls, d) {
    const id = k === 0 ? `c${v}` : `e${v}`;
    return `<svg class="coin${cls}" style="--k:${k};--d:${d}" viewBox="0 0 100 100" aria-hidden="true"><use href="#${id}"/></svg>`;
  }

  function label(p, i) {
    if (!p.length) return `Pocket ${i + 1}: empty`;
    const g = group(p);
    const rest = p.length - g;
    return `Pocket ${i + 1}: ${g} ${name(front(p), g)} at the front${rest ? `, ${rest} more behind` : ''}, ${p.length} of ${CAP}`;
  }

  function render() {
    const had = tray.contains(document.activeElement) ? document.activeElement.dataset.i : null;
    const lifted = sel == null ? 0 : group(pockets[sel]);
    tray.innerHTML = pockets
      .map((p, i) => {
        const target = sel != null && fits(sel, i);
        const cls = ['pocket', p.length ? '' : 'empty', sel === i ? 'sel' : '', target ? 'tgt' : '', popped === i ? 'flash' : ''].filter(Boolean).join(' ');
        const landed = arrived.get(i) || 0;
        let coins = '';
        p.forEach((v, j) => {
          const k = p.length - 1 - j;
          let c = '';
          if (sel === i && k < lifted) c += ' lift';
          if (!still.matches && popped === i) c += ' pop';
          else if (!still.matches && k < landed) c += ' in';
          coins += coinSvg(v, k, c, popped === i ? j : landed - 1 - k);
        });
        let rail = '';
        for (let s = 0; s < CAP; s++) rail += s < p.length ? `<i style="--seg:${COLORS[p[s] - 1]}"></i>` : '<i></i>';
        const flash = popped === i ? ` style="--flash:${COLORS[front(p) - 1]}"` : '';
        return (
          `<button type="button" class="${cls}" data-i="${i}" aria-pressed="${sel === i}" aria-label="${label(p, i)}${target ? ', can take them' : ''}"${flash}>` +
          `<span class="landing" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v13m0 0-5-5m5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` +
          coins +
          `<span class="rail" aria-hidden="true">${rail}</span></button>`
        );
      })
      .join('');
    deal.disabled = busy || empties().length === 0;
    next.setAttribute('href', `#c${Math.min(best + 1, TOP)}`);
    arrived = new Map();
    popped = -1;
    if (had != null) tray.querySelector(`[data-i="${had}"]`)?.focus({ preventScroll: true });
  }

  function lift(i) {
    sel = i;
    const p = pockets[i];
    const g = group(p);
    const n = pockets.filter((_, j) => fits(i, j)).length;
    say(n ? `Lifted ${g} ${name(front(p), g)}. Tap a pocket with amber corners.` : `No pocket can take ${g === 1 ? 'it' : 'them'}. Tap another pocket.`);
  }

  function drop(from, to) {
    const src = pockets[from];
    const dst = pockets[to];
    const v = front(src);
    const n = Math.min(group(src), CAP - dst.length);
    for (let k = 0; k < n; k++) dst.push(src.pop());
    sel = null;
    arrived.set(to, n);
    const left = group(src) && front(src) === v ? group(src) : 0;
    if (dst.length === CAP && dst.every((c) => c === v)) {
      busy = true;
      render();
      say(`Ten ${NAMES[v - 1]} ${v}s…`);
      setTimeout(() => merge(to, v), still.matches ? 150 : 520);
      return;
    }
    render();
    say(left ? `Moved ${n}; ${left} stayed behind: a pocket holds ten.` : `Moved ${n} ${name(v, n)}.${empties().length && !anyMove() ? ' Tap Deal! for new coins.' : ''}`);
    checkStuck();
  }

  function merge(i, v) {
    const up = Math.min(v + 1, TOP);
    pockets[i] = Array(OUT).fill(up);
    const fresh = up > best;
    best = Math.max(best, up);
    busy = false;
    popped = i;
    render();
    if (up === TOP) say('Ten of a kind: you made a 12. In the game, that completes the tray.');
    else say(`Ten of a kind! 10 × ${v} → 5 × ${up}.${fresh ? ` New coin: ${NAMES[up - 1]}. In the game it opens a locked pocket.` : ''}`);
    checkStuck();
  }

  function pile() {
    const onBoard = pockets.flat();
    const lo = onBoard.length ? Math.min(...onBoard) : best - 1;
    const a = Math.max(1, Math.min(lo + Math.floor(Math.random() * 2), best));
    const n = 2 + Math.floor(Math.random() * 4);
    if (Math.random() < 0.4 && n > 2) {
      const b = Math.max(1, Math.min(a + (Math.random() < 0.5 ? 1 : -1), best));
      const cut = 1 + Math.floor(Math.random() * (n - 1));
      return [...Array(cut).fill(b), ...Array(n - cut).fill(a)];
    }
    return Array(n).fill(a);
  }

  function doDeal() {
    if (busy) return;
    const free = empties().slice(0, 2);
    if (!free.length) return;
    sel = null;
    for (const i of free) {
      pockets[i] = pile();
      arrived.set(i, pockets[i].length);
    }
    const keyed = document.activeElement === deal;
    render();
    // A disabled Deal! would drop keyboard focus to <body>: hand it to the first new pile.
    if (keyed && deal.disabled) tray.querySelector(`[data-i="${free[0]}"]`)?.focus({ preventScroll: true });
    say(`Dealt ${free.length} pile${free.length > 1 ? 's' : ''}. Stack the matching fronts.`);
    checkStuck();
  }

  function checkStuck() {
    if (!empties().length && !pockets.some((_, a) => pockets.some((__, b) => fits(a, b)))) {
      say('Out of space! In the game, Undo or Hammer gets you out. Here: Reset.');
    }
  }

  tray.addEventListener('click', (e) => {
    const b = e.target.closest('.pocket');
    if (!b || busy) return;
    const i = Number(b.dataset.i);
    if (sel == null) {
      if (!pockets[i].length) return say('That pocket is empty. Tap one with coins first.');
      lift(i);
    } else if (sel === i) {
      sel = null;
      say('Put back. Tap a pocket to lift its front coins.');
    } else if (fits(sel, i)) {
      drop(sel, i);
      return;
    } else if (pockets[i].length) {
      lift(i);
    } else {
      sel = null;
    }
    render();
  });
  deal.addEventListener('click', doDeal);
  reset.addEventListener('click', start);

  // WebMCP: the visitor's four actions, offered to an AI agent in the browser.
  // Each tool clicks the same control a person would, so the rules stay in one
  // place. Older Chrome builds expose the API on navigator instead of document.
  const mc = document.modelContext || navigator.modelContext;
  if (mc && typeof mc.registerTool === 'function') {
    const settle = () => new Promise((done) => {
      const t0 = Date.now();
      (function wait() { if (!busy || Date.now() - t0 > 1500) done(); else setTimeout(wait, 50); })();
    });
    const state = () => ({
      pockets: pockets.map((p, i) => ({ pocket: i + 1, coins: p.slice(), front: p.length ? name(front(p), group(p)) : null })),
      lifted: sel == null ? null : sel + 1,
      nextCoin: Math.min(best + 1, TOP),
      canDeal: !deal.disabled,
      message: text.textContent,
    });
    const reply = async () => {
      await settle();
      return { content: [{ type: 'text', text: JSON.stringify(state()) }] };
    };
    const none = { type: 'object', properties: {} };
    const tools = [
      {
        name: 'coin_cubby_get_tray',
        description: 'Read the Coin Cubby demo tray: the coins in each of the four pockets (the last coin is at the front), which pocket is lifted, the next new coin, whether Deal! is available, and the message under the tray.',
        inputSchema: none,
        execute: reply,
      },
      {
        name: 'coin_cubby_tap_pocket',
        description: 'Tap pocket 1-4 of the demo tray, as a visitor would. The first tap lifts the same-number coins at its front; tapping an empty pocket, or one whose front coin matches, drops them there. A pocket holds ten, and ten of a kind merge into five of the next number.',
        inputSchema: { type: 'object', properties: { pocket: { type: 'integer', minimum: 1, maximum: 4, description: 'Pocket number, 1-4 from left to right.' } }, required: ['pocket'] },
        execute: (input) => {
          const n = Number(input && input.pocket);
          if (!Number.isInteger(n) || n < 1 || n > pockets.length) throw new Error('pocket must be an integer from 1 to 4');
          tray.querySelector(`[data-i="${n - 1}"]`)?.click();
          return reply();
        },
      },
      {
        name: 'coin_cubby_deal',
        description: 'Press Deal! on the demo tray: new piles drop into up to two empty pockets. Does nothing when no pocket is empty.',
        inputSchema: none,
        execute: () => { if (!deal.disabled) deal.click(); return reply(); },
      },
      {
        name: 'coin_cubby_reset',
        description: 'Reset the demo tray to its starting coins.',
        inputSchema: none,
        execute: () => { reset.click(); return reply(); },
      },
    ];
    for (const t of tools) {
      try { Promise.resolve(mc.registerTool(t)).catch(() => {}); } catch (_) { /* the demo works without it */ }
    }
  }

  start();
})();

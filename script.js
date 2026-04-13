(function () {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // --- SCANLINES ---
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;background:repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 2px);';
  document.body.appendChild(ov);

  const glyphPool = '!@#░▒▓█▄▀■◊●~^*?¿ñøæ∑∆πΩ';
  const rc = () => glyphPool[Math.floor(Math.random() * glyphPool.length)];
  const rh = () => `hsl(${Math.random() * 360 | 0},100%,55%)`;
  const rp = (n) => (Math.random() - 0.5) * 2 * n;

  // Drift state per element
  const drifts = new Map();

  function getDrift(el) {
    if (!drifts.has(el)) drifts.set(el, { x: 0, y: 0, r: 0, ox: el.style.cssText });
    return drifts.get(el);
  }

  // --- EFFECT: drift elements physically ---
  function driftEl(el, strength) {
    const d = getDrift(el);
    d.x += rp(strength * 0.8);
    d.y += rp(strength * 0.5);
    d.r += rp(strength * 0.3);
    // Clamp drift so it doesn't fly off screen
    d.x = Math.max(-strength * 6, Math.min(strength * 6, d.x));
    d.y = Math.max(-strength * 4, Math.min(strength * 4, d.y));
    d.r = Math.max(-strength * 1.5, Math.min(strength * 1.5, d.r));
    el.style.transform = `translate(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px) rotate(${d.r.toFixed(2)}deg)`;
    el.style.position = 'relative';
  }

  // --- EFFECT: swap two text nodes ---
  function swapTexts(nodes) {
    if (nodes.length < 2) return;
    const a = nodes[Math.random() * nodes.length | 0];
    const b = nodes[Math.random() * nodes.length | 0];
    if (a !== b && a.nodeValue && b.nodeValue) {
      [a.nodeValue, b.nodeValue] = [b.nodeValue, a.nodeValue];
    }
  }

  // --- EFFECT: corrupt a string ---
  function corruptStr(str, rate) {
    return str.split('').map(c => c.trim() && Math.random() < rate ? rc() : c).join('');
  }

  // --- EFFECT: glitch input/textarea value ---
  function glitchInput(el, rate) {
    if (!el || !el.value) return;
    const orig = el.value;
    el.value = corruptStr(orig, rate);
    setTimeout(() => el.value = orig, 120);
  }

  // --- EFFECT: shake the translated output box ---
  function shakeOutput(strength) {
    const out = $('.ryNqvb') || $('[jsname="W297wb"]') || $('.lRu31') || $('.HwtpBd');
    if (!out) return;
    driftEl(out, strength * 1.5);
    if (Math.random() < 0.3) out.style.color = rh();
  }

  // --- EFFECT: spin the language selector buttons ---
  function spinLangButtons(strength) {
    $$('.VfPpkd-LgbsSe[jsname], [data-language-code], .ccvoYb').forEach(el => {
      if (Math.random() < 0.4) driftEl(el, strength * 0.8);
    });
  }

  // --- EFFECT: warp the swap-language arrow button ---
  function warpSwapBtn(strength) {
    const btn = $('[jsname="Iqt6T"]') || $('.N37NMd button') || $('[aria-label*="wap"]');
    if (!btn) return;
    btn.style.transform = `rotate(${(Date.now() / (200 / strength)) % 360}deg) scale(${1 + Math.sin(Date.now() / 200) * 0.3 * (strength / 10)})`;
  }

  // --- EFFECT: move entire panels ---
  function joltPanels(strength) {
    const panels = $$('.aTGhEe, .rmcAZb, .j3mWee, .kn8PE, [data-location="source"], [data-location="target"]');
    panels.forEach(p => {
      if (Math.random() < 0.25) driftEl(p, strength);
    });
  }

  // --- EFFECT: randomly reorder child elements of a container ---
  function shuffleChildren(strength) {
    if (Math.random() > strength / 50) return;
    const containers = $$('.aTGhEe, .rmcAZb, .lRu31');
    if (!containers.length) return;
    const c = containers[Math.random() * containers.length | 0];
    const kids = [...c.children];
    if (kids.length < 2) return;
    const i = Math.random() * kids.length | 0;
    const j = Math.random() * kids.length | 0;
    if (i !== j) {
      const ref = kids[j].nextSibling;
      c.insertBefore(kids[j], kids[i]);
      if (ref) c.insertBefore(kids[i], ref);
    }
  }

  // --- EFFECT: RGB split on body ---
  function rgbSplit(strength) {
    const s = strength * 0.6;
    document.body.style.textShadow = `${rp(s)}px 0 rgba(255,0,0,0.5),${rp(s)}px 0 rgba(0,255,0,0.45),${rp(s)}px 0 rgba(0,0,255,0.5)`;
  }

  // --- EFFECT: flash translate button ---
  function flashBtn(strength) {
    const btn = $('[jsname="vSSGHe"]') || $('[aria-label*="Translate"]');
    if (!btn) return;
    btn.style.background = rh();
    btn.style.transform = `scale(${1 + Math.random() * strength * 0.05}) rotate(${rp(strength * 0.5)}deg)`;
  }

  // strength: 1–10
  const STRENGTH = 8;

  let tick = 0;
  setInterval(() => {
    tick++;
    const s = STRENGTH;

    shakeOutput(s);
    spinLangButtons(s);
    warpSwapBtn(s);
    joltPanels(s);
    if (tick % 3 === 0) shuffleChildren(s);
    if (tick % 2 === 0) rgbSplit(s);
    if (tick % 4 === 0) flashBtn(s);

    // Glitch the source textarea
    const ta = $('textarea') || $('[contenteditable="true"]');
    if (ta && Math.random() < 0.08 * (s / 5)) glitchInput(ta, 0.05 * (s / 5));

    // Corrupt output text nodes
    const outEl = $('.ryNqvb') || $('[jsname="W297wb"]');
    if (outEl) {
      const walker = document.createTreeWalker(outEl, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(n => {
        if (n.nodeValue.trim() && Math.random() < 0.12 * (s / 5)) {
          n.nodeValue = corruptStr(n.nodeValue, 0.08 * (s / 5));
        }
      });
      if (Math.random() < 0.15) swapTexts(nodes);
    }
  }, 60);

  console.log('%c🌐 TRANSLATE CORRUPTED', 'color:red;font-size:20px;font-weight:bold');
})();

#!/usr/bin/env node
/** Print clip rect for .jftiEf[index] after scroll — used with browser CDP capture. */
const idx = Number(process.argv[2]);
if (Number.isNaN(idx)) {
  console.error('Usage: capture-review-rect.mjs <index>');
  process.exit(1);
}
console.log(JSON.stringify({ idx, expr: `(() => { const el = document.querySelectorAll('.jftiEf')[${idx}]; if (!el) return JSON.stringify({error:'missing',idx:${idx}}); el.scrollIntoView({block:'center'}); return new Promise(r => setTimeout(() => { const b = el.getBoundingClientRect(); r(JSON.stringify({idx:${idx}, author: el.innerText.split('\\n')[0], x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: b.height})); }, 400)); })()` }));

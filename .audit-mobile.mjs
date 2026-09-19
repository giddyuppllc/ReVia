import { chromium } from '@playwright/test';
const BASE = process.env.BASE || 'https://revialife.vercel.app';
const routes = ['/','/research','/research/retatrutide','/research/bpc-157','/washington','/news','/news/no-buy-button','/blog','/blog/how-to-evaluate-peptide-supplier','/contact','/about','/why-us','/network','/stacks','/faq','/glossary','/learn','/locations','/locations/miami','/locations/miami/retatrutide','/policies','/policies/privacy','/unsubscribe'];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
const errs = [];
for (const r of routes) {
  const p = await ctx.newPage();
  const consoleErrs = [], failed = [];
  p.on('console', m => { if (m.type()==='error') consoleErrs.push(m.text().slice(0,180)); });
  p.on('pageerror', e => consoleErrs.push('PAGEERROR: '+String(e).slice(0,180)));
  p.on('requestfailed', req => failed.push(req.url().slice(0,140)+' :: '+(req.failure()?.errorText||'')));
  let resp;
  try { resp = await p.goto(BASE+r, {waitUntil:'networkidle', timeout:45000}); } catch(e){ errs.push({r, fatal:String(e).slice(0,120)}); await p.close(); continue; }
  await p.waitForTimeout(400);
  const data = await p.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - doc.clientWidth;
    const vw = doc.clientWidth;
    // elements extending past the viewport
    const wide = [];
    for (const el of document.querySelectorAll('body *')) {
      const rr = el.getBoundingClientRect();
      if (rr.width === 0 || rr.height === 0) continue;
      if (rr.right > vw + 2 || rr.left < -2) {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || st.visibility==='hidden' || st.overflowX==='auto' || st.overflowX==='scroll') continue;
        wide.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,90), right: Math.round(rr.right), left: Math.round(rr.left), w: Math.round(rr.width), txt: (el.textContent||'').trim().slice(0,45) });
      }
    }
    // small tap targets
    const taps = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea, [role=button]')) {
      const rr = el.getBoundingClientRect();
      if (rr.width===0||rr.height===0) continue;
      if (getComputedStyle(el).visibility==='hidden') continue;
      if (rr.height < 44 || rr.width < 44) taps.push({ tag: el.tagName.toLowerCase(), h: Math.round(rr.height), w: Math.round(rr.width), txt: (el.textContent||el.getAttribute('aria-label')||el.getAttribute('placeholder')||'').trim().slice(0,40), cls:(el.className||'').toString().slice(0,60) });
    }
    // tiny text
    const tiny = new Map();
    for (const el of document.querySelectorAll('p,li,span,td,a,div,h1,h2,h3,h4,label')) {
      if (!el.childNodes.length) continue;
      const direct = Array.from(el.childNodes).some(n=>n.nodeType===3 && n.textContent.trim().length>12);
      if (!direct) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) { const k = fs+'px|'+(el.className||'').toString().slice(0,50); tiny.set(k,(tiny.get(k)||0)+1); }
    }
    // broken imgs
    const imgs = [...document.querySelectorAll('img')].map(i=>({src:i.currentSrc||i.src, nw:i.naturalWidth, dw:Math.round(i.getBoundingClientRect().width), alt:i.alt})).filter(i=>i.nw===0 || i.nw < i.dw*0.9);
    return { overflow, vw, wide: wide.slice(0,10), taps, tiny:[...tiny.entries()].slice(0,8), imgs, title: document.title, h1: document.querySelector('h1')?.textContent?.trim().slice(0,70) ?? null, bodyLen: document.body.innerText.trim().length };
  });
  errs.push({ r, status: resp?.status(), ...data, consoleErrs, failed: failed.slice(0,5) });
  await p.close();
}
await b.close();
console.log(JSON.stringify(errs, null, 1));

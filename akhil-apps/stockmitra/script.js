/* =========================================================
   StockMitra
   - past prices: Alpha Vantage weekly data (key in config.js),
     a CSV from NSE/BSE, or a clearly marked practice company
   - beginner rules check, monthly (SIP) vs one-time lesson,
     yearly table, interactive chart
   - IPO checker (type, or read the details from a photo)
   - words explained + Mitra helper bot (Gemini, or the
     built-in word list when no key is set)
   ========================================================= */
(function () {
  'use strict';
  Q.shell('stockmitra');
  const $ = Q.$, D = window.SM_DATA;
  const AV_KEY = Q.key('ALPHA_VANTAGE_API_KEY');
  const COLORS = { price: '#4a3aa7', ma10: '#eb6834', ma40: '#1baf7a' }; // validated for colour-blind separation

  /* =================== tabs =================== */
  const tabBtns = [...document.querySelectorAll('.tabs [role=tab]')];
  function showTab(id) {
    tabBtns.forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('tab-' + b.dataset.tab).hidden = !on; });
    if (id === 'stocks' && cur) requestAnimationFrame(() => drawChart());
  }
  tabBtns.forEach((b, i) => {
    b.addEventListener('click', () => showTab(b.dataset.tab));
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = tabBtns[(i + d + tabBtns.length) % tabBtns.length]; n.focus(); showTab(n.dataset.tab); }
    });
  });

  /* =================== words with a meaning popup =================== */
  const pop = $('term-pop');
  function openTerm(el) {
    const g = D.byKey[el.dataset.term]; if (!g) return;
    pop.innerHTML = `<h4>${Q.esc(g.term)}</h4><p>${Q.esc(g.meaning)}</p><p class="ex">${Q.esc(g.example)}</p>
      <div class="row"><button class="btn btn-sm btn-app" type="button" data-ask="${g.key}">Ask Mitra more</button><button class="btn btn-sm btn-quiet" type="button" data-close>Close</button></div>`;
    pop.hidden = false;
    const r = el.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    pop.style.left = Math.min(Math.max(12, r.left), innerWidth - pw - 12) + 'px';
    pop.style.top = (r.bottom + 8 + ph > innerHeight - 12 ? Math.max(12, r.top - ph - 8) : r.bottom + 8) + 'px';
    pop.querySelector('[data-ask]').focus();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('.term');
    if (t) { e.preventDefault(); openTerm(t); return; }
    if (!e.target.closest('#term-pop')) pop.hidden = true;
  });
  pop.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) pop.hidden = true;
    const a = e.target.closest('[data-ask]');
    if (a) { pop.hidden = true; mitraAsk(`Explain "${D.byKey[a.dataset.ask].term}" with a simple example.`); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { pop.hidden = true; if (!$('mitra').hidden) closeMitra(); } });
  addEventListener('scroll', () => { pop.hidden = true; }, { passive: true });
  const term = (key, text) => `<button type="button" class="term" data-term="${key}">${text}</button>`;

  /* =================== picking a share =================== */
  let cur = null;          // { sym, name, about, series, source, practice, a: analysis }
  let weeks = 260;
  const showMA = { ma10: true, ma40: true };

  function renderChips() {
    $('stock-chips').innerHTML = D.STOCKS.map(s => `<button type="button" class="chip" data-sym="${s.sym}" aria-pressed="${!!cur && cur.sym === s.sym}">${Q.esc(s.name)}</button>`).join('')
      + `<button type="button" class="chip" data-sym="PRACTICE" aria-pressed="${!!cur && cur.sym === 'PRACTICE'}">Practice Ltd <small>(made-up)</small></button>`;
  }
  if (!AV_KEY) $('key-note').innerHTML = Q.notice('warn', '<b>Real prices need a free Alpha Vantage key.</b> Paste it after ALPHA_VANTAGE_API_KEY in config.js and refresh. Until then, try <b>Practice Ltd</b> (a made-up company) or upload a CSV price file.');
  else $('av-status').textContent = 'Real prices from Alpha Vantage. Each share uses 1 of your 25 free look-ups a day.';
  renderChips();

  $('stock-chips').addEventListener('click', e => {
    const b = e.target.closest('[data-sym]'); if (!b) return;
    loadSymbol(b.dataset.sym, D.STOCKS.find(s => s.sym === b.dataset.sym), b);
  });
  $('sym-form').addEventListener('submit', e => {
    e.preventDefault();
    let s = $('sym').value.trim().toUpperCase().replace(/\s+/g, '');
    if (!s) return $('sym').focus();
    if (!s.includes('.')) s += '.BSE';
    loadSymbol(s, D.STOCKS.find(x => x.sym === s), e.submitter);
  });
  $('csv').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    try {
      const series = parseCSV(await f.text());
      show({ sym: 'CSV', name: f.name.replace(/\.csv$/i, ''), about: 'Prices from the file you uploaded', series, source: `From your file ${f.name}: ${series.length} weeks, last week ${Q.date(series.at(-1).t)}. Daily prices were turned into weekly closing prices.` });
    } catch (err) { Q.fail(err); }
  });

  async function loadSymbol(sym, meta, btn) {
    if (sym === 'PRACTICE') {
      return show({ sym, name: 'Practice Ltd', about: 'A made-up company with practice prices, so you can learn the tools. Not real data.', series: D.practiceSeries(), practice: true,
        source: 'Practice prices for a made-up company, generated by the app. Not real data.' });
    }
    if (!AV_KEY) return Q.toast('Alpha Vantage key needed', 'Paste your free key after ALPHA_VANTAGE_API_KEY in config.js, or try Practice Ltd.', 'bad');
    Q.busy(btn, true);
    try {
      const { series, adjusted } = await fetchWeekly(sym);
      show({ sym, name: meta ? meta.name : sym.replace(/\.BSE$/, ''), about: meta ? meta.about : 'BSE code ' + sym.replace(/\.BSE$/, ''), series,
        source: `Weekly closing prices from Alpha Vantage (BSE)${adjusted ? ', adjusted for bonus shares, splits and dividends' : '. Not adjusted for bonus shares or splits, so a sudden drop on such a date is not a real loss'}. Last week shown: ${Q.date(series.at(-1).t)}.` });
    } catch (err) { Q.fail(err); }
    finally { Q.busy(btn, false); }
  }

  async function avGet(fn, sym) {
    let res;
    try { res = await fetch(`https://www.alphavantage.co/query?function=${fn}&symbol=${encodeURIComponent(sym)}&apikey=${encodeURIComponent(AV_KEY)}`); }
    catch (e) { throw new Q.QError('Could not reach Alpha Vantage', Q.isFile ? 'Check your internet. If it still fails, open the folder with VS Code Live Server (Go Live).' : 'Check your internet connection and try again.'); }
    const data = await res.json().catch(() => ({}));
    const info = String(data.Information || data.Note || '');
    const err = String(data['Error Message'] || '');
    if (/rate limit|requests per day|per minute|call frequency/i.test(info)) throw new Q.QError('Daily limit reached', 'The free Alpha Vantage key allows 25 look-ups a day. Shares you already opened today still work. Try others tomorrow.');
    if (/premium endpoint/i.test(info)) return { premium: true };
    if (/apikey/i.test(err) || /api key/i.test(info)) throw new Q.QError('Alpha Vantage key not accepted', 'Check ALPHA_VANTAGE_API_KEY in config.js. Get a free key at alphavantage.co.');
    if (err) throw new Q.QError('Share code not found', `Alpha Vantage does not know "${sym}". Indian shares need .BSE at the end, for example WIPRO.BSE. Check the code on bseindia.com.`);
    if (info) throw new Q.QError('Alpha Vantage says', info);
    return { data };
  }
  async function fetchWeekly(sym) {
    const today = new Date().toISOString().slice(0, 10), ck = 'stockmitra.av.' + sym;
    const cached = Q.load(ck, null);
    if (cached && cached.day === today && cached.series?.length) return cached;
    let r = await avGet('TIME_SERIES_WEEKLY_ADJUSTED', sym), adjusted = true;
    if (r.premium) { r = await avGet('TIME_SERIES_WEEKLY', sym); adjusted = false; }
    const k = Object.keys(r.data || {}).find(x => /time series/i.test(x));
    if (!k) throw new Q.QError('No prices found', `Alpha Vantage returned no prices for ${sym}. Check the code on bseindia.com.`);
    const ts = r.data[k];
    const series = Object.keys(ts).sort().map(d => ({ t: new Date(d + 'T00:00:00').getTime(), c: +(ts[d]['5. adjusted close'] || ts[d]['4. close']) })).filter(p => p.c > 0);
    if (series.length < 12) throw new Q.QError('Too little history', `Only ${series.length} weeks of prices for ${sym}. Try a company that has been listed longer.`);
    const out = { day: today, series, adjusted };
    Q.save(ck, out);
    return out;
  }

  /* ---------- CSV from NSE / BSE / anywhere ---------- */
  function splitCSV(line) {
    const out = []; let cell = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (q && line[i + 1] === '"') { cell += '"'; i++; } else q = !q; }
      else if (ch === ',' && !q) { out.push(cell); cell = ''; }
      else cell += ch;
    }
    out.push(cell);
    return out.map(c => c.trim());
  }
  const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function parseDate(s) {
    s = String(s || '').replace(/"/g, '').trim(); let m;
    const y4 = y => (y.length === 2 ? 2000 + +y : +y);
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))) return new Date(+m[1], m[2] - 1, +m[3]).getTime();
    if ((m = /^(\d{1,2})[-/ ]([A-Za-z]{3})[A-Za-z]*[-/ ,]+(\d{2,4})/.exec(s)) && MONTHS[m[2].toLowerCase()] != null) return new Date(y4(m[3]), MONTHS[m[2].toLowerCase()], +m[1]).getTime();
    if ((m = /^([A-Za-z]{3})[A-Za-z]*[ -](\d{1,2}),?[ -](\d{4})/.exec(s)) && MONTHS[m[1].toLowerCase()] != null) return new Date(+m[3], MONTHS[m[1].toLowerCase()], +m[2]).getTime();
    if ((m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/.exec(s))) return new Date(y4(m[3]), m[2] - 1, +m[1]).getTime(); // Indian dd/mm/yyyy
    return null;
  }
  function parseCSV(text) {
    const rows = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim()).map(splitCSV);
    const h = rows.findIndex(r => r.some(c => /date/i.test(c)) && r.some(c => /close|ltp/i.test(c)));
    if (h < 0) throw new Q.QError('Columns not found', 'The file needs a "Date" column and a "Close" column, like the historical data files from nseindia.com or bseindia.com.');
    const head = rows[h].map(c => c.toLowerCase().trim());
    const di = head.findIndex(c => /date/.test(c));
    let ci = head.findIndex(c => /^close( price)?$/.test(c));
    if (ci < 0) ci = head.findIndex(c => /close/.test(c) && !/prev/.test(c));
    if (ci < 0) ci = head.findIndex(c => /ltp/.test(c));
    const daily = [];
    for (const r of rows.slice(h + 1)) {
      const t = parseDate(r[di]), c = parseFloat(String(r[ci] || '').replace(/[,₹\s]/g, ''));
      if (t && c > 0) daily.push({ t, c });
    }
    daily.sort((a, b) => a.t - b.t);
    const weekly = [];
    for (const p of daily) {  // keep the last price of each week (weeks start on Monday)
      const d = new Date(p.t), mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
      if (weekly.length && weekly.at(-1).w === mon.getTime()) weekly[weekly.length - 1] = { w: mon.getTime(), t: p.t, c: p.c };
      else weekly.push({ w: mon.getTime(), t: p.t, c: p.c });
    }
    if (weekly.length < 12) throw new Q.QError('Too few prices', `Found ${daily.length} days of prices. Download at least 3 months, ideally 5 years.`);
    return weekly.map(({ t, c }) => ({ t, c }));
  }

  /* =================== analysis =================== */
  const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
  const std = a => { const m = avg(a); return Math.sqrt(avg(a.map(x => (x - m) ** 2))); };
  function analyse(series) {
    const c = series.map(p => p.c), n = c.length, last = c[n - 1];
    const ma = k => c.map((_, i) => (i >= k - 1 ? avg(c.slice(i - k + 1, i + 1)) : null));
    const yr = c.slice(-52), hi = Math.max(...yr), lo = Math.min(...yr);
    const ago = w => (n > w ? c[n - 1 - w] : null);
    const growth = y => { const a = ago(52 * y); return a ? (Math.pow(last / a, 1 / y) - 1) * 100 : null; };
    const rets = []; for (let i = Math.max(1, n - 52); i < n; i++) rets.push(Math.log(c[i] / c[i - 1]));
    const from = Math.max(0, n - 260);
    let peak = c[from], peakI = from, dd = 0, ddPeak = from, ddLow = from;
    for (let i = from; i < n; i++) {
      if (c[i] > peak) { peak = c[i]; peakI = i; }
      const d = (c[i] / peak - 1) * 100;
      if (d < dd) { dd = d; ddPeak = peakI; ddLow = i; }
    }
    return {
      last, ma10: ma(10), ma40: ma(40), hi, lo, pos: hi > lo ? (last - lo) / (hi - lo) : 0.5,
      chg1y: ago(52) ? (last / ago(52) - 1) * 100 : null, g1: growth(1), g3: growth(3), g5: growth(5),
      vol: rets.length > 8 ? std(rets) * Math.sqrt(52) * 100 : null, dd, ddPeakT: series[ddPeak].t, ddLowT: series[ddLow].t,
      years: (series[n - 1].t - series[from].t) / (365.25 * 864e5)
    };
  }

  /* =================== show a share =================== */
  function show(stock) {
    stock.a = analyse(stock.series);
    cur = stock;
    renderChips();
    $('stock-empty').hidden = true; $('stock-view').hidden = false;
    const a = stock.a, n = stock.series.length;
    $('s-name').innerHTML = Q.esc(stock.name) + (stock.practice ? ' <span class="status warn practice-flag">Practice data</span>' : '');
    $('s-about').textContent = stock.about;
    $('s-price').textContent = Q.inr(a.last, a.last < 1000 ? 2 : 0);
    $('s-change').innerHTML = a.chg1y == null ? '<span class="muted small">Less than a year of prices</span>'
      : `<span class="chg ${a.chg1y >= 0 ? 'up' : 'down'}">${a.chg1y >= 0 ? '▲' : '▼'} ${Math.abs(a.chg1y).toFixed(1)}% in 1 year</span>`;
    $('s-source').textContent = stock.source;
    // keep range buttons sensible for short histories
    document.querySelectorAll('#range button').forEach(b => { const w = +b.dataset.w; b.disabled = w > 0 && n < w * 0.6; });
    if (weeks && n < weeks * 0.6) weeks = 0;
    document.querySelectorAll('#range button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.w === weeks));
    renderLegend(); drawChart(); renderRules(); renderSipYears(); renderSip(); renderYears();
    $('stock-view').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  $('range').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    weeks = +b.dataset.w;
    document.querySelectorAll('#range button').forEach(x => x.setAttribute('aria-pressed', x === b));
    drawChart();
  });

  function renderLegend() {
    $('legend').innerHTML = `<label class="fixed"><span class="key" style="border-color:${COLORS.price}"></span>Weekly price</label>
      <label><input type="checkbox" data-ma="ma10" ${showMA.ma10 ? 'checked' : ''}><span class="key" style="border-color:${COLORS.ma10}"></span>10-week average</label>
      <label><input type="checkbox" data-ma="ma40" ${showMA.ma40 ? 'checked' : ''}><span class="key" style="border-color:${COLORS.ma40}"></span>40-week average</label>`;
  }
  $('legend').addEventListener('change', e => { const k = e.target.dataset.ma; if (k) { showMA[k] = e.target.checked; drawChart(); } });

  /* ---------- chart (canvas, with hover and arrow keys) ---------- */
  const cv = $('chart'), wrap = $('chart-wrap'), tip = $('chart-tip');
  let view = null, hoverI = null;
  cv.tabIndex = 0;
  const niceStep = (span, count) => { const raw = span / count, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; };
  const money = (v, step) => '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: step >= 1 ? 0 : step >= 0.1 ? 1 : 2, minimumFractionDigits: step >= 1 ? 0 : step >= 0.1 ? 1 : 2 });

  function drawChart() {
    if (!cur || $('tab-stocks').hidden || $('stock-view').hidden) return;
    const s = cur.series, A = cur.a, n = s.length, startI = weeks && n > weeks ? n - weeks : 0;
    const pts = s.slice(startI), m10 = A.ma10.slice(startI), m40 = A.ma40.slice(startI);
    const w = wrap.clientWidth, h = wrap.clientHeight, dpr = window.devicePixelRatio || 1;
    if (!w || !h) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const narrow = w < 560;
    const pad = { l: narrow ? 54 : 66, r: narrow ? 10 : 92, t: 12, b: 28 };
    const vals = pts.map(p => p.c).concat(showMA.ma10 ? m10.filter(v => v != null) : [], showMA.ma40 ? m40.filter(v => v != null) : []);
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const extra = (hi - lo) * 0.06 || hi * 0.05; lo -= extra; hi += extra;
    const step = niceStep(hi - lo, narrow ? 3 : 4);
    lo = Math.max(0, Math.floor(lo / step) * step); hi = Math.ceil(hi / step) * step;
    const X = i => pad.l + (pts.length < 2 ? 0 : i / (pts.length - 1)) * (w - pad.l - pad.r);
    const Y = v => pad.t + (1 - (v - lo) / (hi - lo)) * (h - pad.t - pad.b);
    const font = '"Anek Latin", system-ui, sans-serif';

    // grid and price axis
    ctx.font = `13px ${font}`; ctx.lineWidth = 1;
    for (let v = lo; v <= hi + step / 2; v += step) {
      const y = Math.round(Y(v)) + 0.5;
      ctx.strokeStyle = '#e6e8ec'; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = '#646b78'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(money(v, step), pad.l - 8, y);
    }
    // time axis
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const span = (pts.at(-1).t - pts[0].t) / (365.25 * 864e5);
    let lastX = -1e9;
    pts.forEach((p, i) => {
      if (!i) return;
      const d = new Date(p.t), prev = new Date(pts[i - 1].t);
      let label = null;
      if (span > 2.5) { if (d.getFullYear() !== prev.getFullYear()) label = String(d.getFullYear()); }
      else if (d.getMonth() !== prev.getMonth() && d.getMonth() % (span > 1.3 ? 3 : 2) === 0) label = d.toLocaleDateString('en-IN', { month: 'short' }) + (d.getMonth() < 2 || span > 1.3 ? ' ' + String(d.getFullYear()).slice(2) : '');
      if (label) { const x = X(i); if (x - lastX > 46 && x > pad.l + 16) { ctx.fillText(label, x, h - 8); lastX = x; } }
    });

    // lines: averages first, price on top
    const line = (arr, get, color) => {
      ctx.beginPath(); let on = false;
      arr.forEach((v, i) => { const val = get(v); if (val == null) { on = false; return; } const x = X(i), y = Y(val); if (on) ctx.lineTo(x, y); else { ctx.moveTo(x, y); on = true; } });
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    };
    if (showMA.ma40) line(m40, v => v, COLORS.ma40);
    if (showMA.ma10) line(m10, v => v, COLORS.ma10);
    line(pts, p => p.c, COLORS.price);

    // value at the end of each line (wide screens), with leader lines if nudged apart
    if (!narrow) {
      const L = [{ y0: Y(pts.at(-1).c), text: money(pts.at(-1).c, pts.at(-1).c < 1000 ? 0.01 : 1), color: COLORS.price, bold: true }];
      if (showMA.ma10 && m10.at(-1) != null) L.push({ y0: Y(m10.at(-1)), text: '10-wk avg', color: COLORS.ma10 });
      if (showMA.ma40 && m40.at(-1) != null) L.push({ y0: Y(m40.at(-1)), text: '40-wk avg', color: COLORS.ma40 });
      L.forEach(l => { l.y = l.y0; });
      L.sort((a, b) => a.y - b.y);
      for (let i = 1; i < L.length; i++) if (L[i].y - L[i - 1].y < 17) L[i].y = L[i - 1].y + 17;
      const overflow = L.at(-1).y - (h - pad.b); if (overflow > 0) L.forEach(l => { l.y -= overflow; });
      const xEnd = w - pad.r, x0 = xEnd + 8;
      L.forEach(l => {
        if (Math.abs(l.y - l.y0) > 1) { ctx.strokeStyle = '#c3c8cf'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xEnd + 2, l.y0); ctx.lineTo(x0, l.y); ctx.stroke(); }
        ctx.strokeStyle = l.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, l.y); ctx.lineTo(x0 + 9, l.y); ctx.stroke();
        ctx.fillStyle = '#1d2129'; ctx.font = `${l.bold ? 600 : 400} 13px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(l.text, x0 + 13, l.y);
      });
    }

    // hover crosshair
    if (hoverI != null && hoverI < pts.length) {
      const x = Math.round(X(hoverI)) + 0.5;
      ctx.strokeStyle = '#9aa1ad'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke();
      const dot = (v, color) => { if (v == null) return; ctx.beginPath(); ctx.arc(x, Y(v), 4.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); };
      if (showMA.ma40) dot(m40[hoverI], COLORS.ma40);
      if (showMA.ma10) dot(m10[hoverI], COLORS.ma10);
      dot(pts[hoverI].c, COLORS.price);
    }
    view = { X, pad, w, pts, m10, m40 };
    cv.setAttribute('aria-label', `${cur.name} weekly price from ${Q.date(pts[0].t)} to ${Q.date(pts.at(-1).t)}: ${money(pts[0].c, 1)} to ${money(pts.at(-1).c, 1)}. Use left and right arrow keys to read each week.`);
  }

  function showTip(i) {
    if (!view) return;
    const p = view.pts[i], x = view.X(i);
    const r = (label, v, color) => v == null ? '' : `<div class="r"><span><i style="border-color:${color}"></i>${label}</span><b style="margin:0">${money(v, v < 1000 ? 0.01 : 1)}</b></div>`;
    tip.innerHTML = `<b>Week of ${Q.date(p.t)}</b>${r('Price', p.c, COLORS.price)}${showMA.ma10 ? r('10-wk avg', view.m10[i], COLORS.ma10) : ''}${showMA.ma40 ? r('40-wk avg', view.m40[i], COLORS.ma40) : ''}`;
    tip.hidden = false;
    const tw = tip.offsetWidth;
    tip.style.left = (x + 14 + tw > view.w ? Math.max(4, x - tw - 14) : x + 14) + 'px';
    tip.style.top = '10px';
  }
  function hoverAt(i) { hoverI = i; drawChart(); if (i == null) tip.hidden = true; else showTip(i); }
  cv.addEventListener('pointermove', e => {
    if (!view) return;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left;
    const i = Math.round((x - view.pad.l) / (view.w - view.pad.l - view.pad.r) * (view.pts.length - 1));
    hoverAt(i < 0 || i >= view.pts.length ? null : i);
  });
  cv.addEventListener('pointerleave', () => hoverAt(null));
  cv.addEventListener('keydown', e => {
    if (!view) return;
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault();
    hoverAt(Math.min(view.pts.length - 1, Math.max(0, (hoverI ?? view.pts.length - 1) + d)));
  });
  cv.addEventListener('blur', () => hoverAt(null));
  if ('ResizeObserver' in window) new ResizeObserver(() => drawChart()).observe(wrap);

  /* ---------- beginner rules ---------- */
  function rulesFor(a) {
    const out = [], ma40 = a.ma40.at(-1);
    const add = (kind, title, text) => out.push({ kind, title, text });
    if (ma40 != null) {
      const gap = (a.last / ma40 - 1) * 100;
      a.last >= ma40
        ? add('ok', 'Trend: going up', `The price is ${gap.toFixed(0)}% above its ${term('moving-average', '40-week average')} (about the 200-day average many investors watch). That is usually called an ${term('trend', 'uptrend')}.`)
        : add('warn', 'Trend: going down', `The price is ${Math.abs(gap).toFixed(0)}% below its ${term('moving-average', '40-week average')}. Many beginners wait for the price to climb back above it before buying.`);
    }
    {
      const p = Math.round(a.pos * 100);
      a.pos > 0.85 ? add('warn', 'Near its 1-year high', `It is close to the top of its ${term('52w', '52-week range')} (${Q.inr(a.lo)} to ${Q.inr(a.hi)}). Buying here means paying a high price; buying in small parts over months lowers that risk.`)
        : a.pos < 0.15 ? add('warn', 'Near its 1-year low', `It is close to the bottom of its ${term('52w', '52-week range')} (${Q.inr(a.lo)} to ${Q.inr(a.hi)}). Cheaper than usual, but find out why it fell (results, news) before buying.`)
          : add('ok', 'Middle of its 1-year range', `It is ${p}% of the way from its 1-year low (${Q.inr(a.lo)}) to its high (${Q.inr(a.hi)}). Not at an extreme.`);
    }
    if (a.chg1y != null) {
      a.chg1y > 50 ? add('warn', 'Rose very fast', `Up ${a.chg1y.toFixed(0)}% in one year. Prices that rise fast can fall fast. Do not chase it with money you cannot leave for years.`)
        : a.chg1y < -30 ? add('warn', 'Fell a lot this year', `Down ${Math.abs(a.chg1y).toFixed(0)}% in one year. A big fall can be a bargain or a warning. Read the company's latest results first.`)
          : add('ok', 'No wild jump this year', `${a.chg1y >= 0 ? 'Up' : 'Down'} ${Math.abs(a.chg1y).toFixed(0)}% in one year.`);
    }
    if (a.vol != null) {
      const v = Math.round(a.vol);
      a.vol < 22 ? add('ok', 'Fairly steady', `${term('volatility', 'Volatility')} is about ${v}% a year: smaller swings than most single shares.`)
        : a.vol < 35 ? add('warn', 'Medium swings', `${term('volatility', 'Volatility')} is about ${v}% a year. A ₹10,000 holding can easily move ₹${(v * 100).toLocaleString('en-IN')} up or down in a year.`)
          : add('bad', 'Big swings', `${term('volatility', 'Volatility')} is about ${v}% a year. Expect large ups and downs; only put in an amount you can watch fall without panicking.`);
    }
    const dd = Math.abs(a.dd);
    if (dd > 1) {
      const when = `from ${Q.date(a.ddPeakT)} to ${Q.date(a.ddLowT)}`;
      dd < 25 ? add('ok', 'Worst fall was modest', `Its biggest ${term('drawdown', 'fall')} in the last ${Math.min(5, Math.round(a.years)) || 1} years was ${dd.toFixed(0)}% (${when}).`)
        : add(dd < 45 ? 'warn' : 'bad', `Once fell ${dd.toFixed(0)}%`, `It fell ${dd.toFixed(0)}% ${when}. Ask yourself: would you have held on? If not, start smaller.`);
    }
    const g = a.g5 != null ? [a.g5, 5] : a.g3 != null ? [a.g3, 3] : null;
    if (g) {
      g[0] > 7 ? add('ok', 'Beat a fixed deposit', `Grew about ${g[0].toFixed(1)}% a year over ${g[1]} years (${term('cagr', 'CAGR')}), more than a typical 7% ${term('fd', 'FD')}. Past growth does not promise future growth.`)
        : add(g[0] < 0 ? 'bad' : 'warn', 'Did not beat a fixed deposit', `Grew about ${g[0].toFixed(1)}% a year over ${g[1]} years (${term('cagr', 'CAGR')}), less than a typical 7% ${term('fd', 'FD')}.`);
    }
    return out;
  }
  const KIND_WORD = { ok: 'Looks fine', warn: 'Be careful', bad: 'High risk' };
  function renderRules() {
    const list = rulesFor(cur.a);
    $('rules').innerHTML = list.map(r => `<li><span class="status ${r.kind}">${KIND_WORD[r.kind]}</span><b>${r.title}</b><p>${r.text}</p></li>`).join('');
    const c = k => list.filter(r => r.kind === k).length;
    const fine = c('ok'), care = c('warn') + c('bad');
    $('rules-sum').textContent = `${fine} ${fine === 1 ? 'looks' : 'look'} fine, ${care} to be careful about`;
  }

  /* ---------- monthly (SIP) vs all at once ---------- */
  function renderSipYears() {
    const n = cur.series.length, opts = [1, 3, 5, 10].filter(y => n >= 52 * y);
    const prev = +$('sip-yrs').value || 5;
    $('sip-yrs').innerHTML = (opts.length ? opts : [0]).map(y => `<option value="${y}">${y ? y + (y === 1 ? ' year' : ' years') : 'All available'}</option>`).join('');
    $('sip-yrs').value = String(opts.includes(prev) ? prev : opts.at(-1) || 0);
  }
  function sipCalc(series, monthly, years) {
    const endT = series.at(-1).t;
    const start = new Date(endT); if (years) start.setFullYear(start.getFullYear() - years);
    const pts = years ? series.filter(p => p.t > start.getTime()) : series;
    const seen = new Set(); let units = 0, invested = 0;
    for (const p of pts) {
      const d = new Date(p.t), k = d.getFullYear() * 12 + d.getMonth();
      if (seen.has(k)) continue;
      seen.add(k); units += monthly / p.c; invested += monthly;
    }
    const last = series.at(-1).c;
    return { months: seen.size, invested, value: units * last, avgPrice: invested / units, startPrice: pts[0].c, startT: pts[0].t, lump: invested / pts[0].c * last };
  }
  function renderSip() {
    if (!cur) return;
    const amt = Math.max(100, +$('sip-amt').value || 1000), yrs = +$('sip-yrs').value;
    const r = sipCalc(cur.series, amt, yrs);
    const gain = v => `${v >= r.invested ? '▲' : '▼'} ${Math.abs((v / r.invested - 1) * 100).toFixed(1)}%`;
    const sipWins = r.value >= r.lump;
    $('sip-out').innerHTML = `
      <div class="sip-cards">
        <div class="sip-card${sipWins ? ' win' : ''}"><span class="small">Every month: ${Q.inr(amt)} × ${r.months}</span><div class="big">${Q.inr(r.value)}</div><span class="small">${gain(r.value)} on ${Q.inr(r.invested)}. Average price paid ${Q.inr(r.avgPrice, 2)}</span></div>
        <div class="sip-card${sipWins ? '' : ' win'}"><span class="small">All at once on ${Q.date(r.startT)}</span><div class="big">${Q.inr(r.lump)}</div><span class="small">${gain(r.lump)} on ${Q.inr(r.invested)}. Price that day ${Q.inr(r.startPrice, 2)}</span></div>
      </div>
      <p class="sip-say">${sipWins
        ? 'Investing monthly did better here: you kept buying when the price was lower than on the first day.'
        : 'Putting it all in on day one did better here, because the price mostly rose afterwards. Nobody knows that in advance, which is why many beginners invest a fixed amount every month.'}</p>
      ${cur.practice ? '<p class="ai-note" style="margin-top:6px">Practice data for a made-up company.</p>' : ''}`;
  }
  $('sip-amt').addEventListener('input', renderSip);
  $('sip-yrs').addEventListener('change', renderSip);

  /* ---------- yearly table (also the table view of the chart) ---------- */
  function renderYears() {
    const by = new Map();
    cur.series.forEach(p => { const y = new Date(p.t).getFullYear(); if (!by.has(y)) by.set(y, []); by.get(y).push(p.c); });
    const ys = [...by.keys()].sort((a, b) => b - a);
    const rows = ys.map(y => {
      const v = by.get(y), prevEnd = by.get(y - 1)?.at(-1), base = prevEnd ?? v[0], end = v.at(-1), ch = (end / base - 1) * 100;
      return `<tr><td>${y}${y === new Date().getFullYear() ? ' (so far)' : ''}</td><td class="num">${Q.inr(base, base < 1000 ? 2 : 0)}</td><td class="num">${Q.inr(end, end < 1000 ? 2 : 0)}</td><td class="num hide-sm">${Q.inr(Math.min(...v), 0)} to ${Q.inr(Math.max(...v), 0)}</td><td class="num"><span class="chg ${ch >= 0 ? 'up' : 'down'}">${ch >= 0 ? '▲' : '▼'} ${Math.abs(ch).toFixed(1)}%</span></td></tr>`;
    });
    $('years').innerHTML = `<thead><tr><th>Year</th><th class="num">Start</th><th class="num">End</th><th class="num hide-sm">Low to high</th><th class="num">Change</th></tr></thead><tbody>${rows.join('')}</tbody>`;
  }

  $('ask-stock').addEventListener('click', () => {
    if (!cur) return;
    mitraAsk(`I'm a beginner looking at ${cur.name}. Explain what these numbers mean for me, in simple words, and what I should check before deciding.`);
  });
  function stockFacts() {
    if (!cur) return '';
    const a = cur.a, f = v => (v == null ? 'n/a' : v.toFixed(1) + '%');
    return `The user is looking at ${cur.name}${cur.practice ? ' (a made-up practice company with generated prices)' : ` (${cur.sym})`}. Facts the app computed from weekly closing prices: latest price ₹${a.last.toFixed(2)}; 1-year change ${f(a.chg1y)}; 52-week range ₹${a.lo.toFixed(0)} to ₹${a.hi.toFixed(0)}; 40-week average ₹${a.ma40.at(-1)?.toFixed(0) ?? 'n/a'}; yearly volatility ${f(a.vol)}; worst fall in 5 years ${f(a.dd)}; growth per year: 1y ${f(a.g1)}, 3y ${f(a.g3)}, 5y ${f(a.g5)}.`;
  }

  /* =================== IPO checker =================== */
  let ipoShots = null;
  $('ipo-photo-btn').addEventListener('click', () => {
    const box = $('ipo-photo'); box.hidden = !box.hidden;
    if (!ipoShots) ipoShots = new Q.Shots($('ipo-shots'), { max: 2, title: 'Photo of the IPO details', hint: 'The IPO page in your broker app, or a newspaper ad. Up to 2 photos.' });
  });
  $('ipo-read').addEventListener('click', async e => {
    if (!ipoShots || !ipoShots.items.length) return Q.toast('Add a photo first', 'Take or upload a photo of the IPO details.');
    const btn = e.currentTarget;
    Q.busy(btn, true, 'Reading…');
    try {
      const n = Q.S.maybe(Q.S.num());
      const r = await Q.gemini({
        json: true, temperature: 0.1,
        schema: Q.S.obj({ company: Q.S.maybe(Q.S.str()), price_band_low: n, price_band_high: n, lot_size: n, issue_size_cr: n, fresh_issue_cr: n, ofs_cr: n, pe: n, peer_pe: n, retail_times: n, qib_times: n, close_date: Q.S.maybe(Q.S.str('YYYY-MM-DD')) }),
        parts: [...ipoShots.parts(), { text: `Read the Indian IPO details in these photos. Return JSON only:
{"company": string|null, "price_band_low": number|null, "price_band_high": number|null, "lot_size": number|null, "issue_size_cr": number|null, "fresh_issue_cr": number|null, "ofs_cr": number|null, "pe": number|null, "peer_pe": number|null, "retail_times": number|null, "qib_times": number|null, "close_date": "YYYY-MM-DD"|null}
Amounts in rupees crore. Use null for anything not clearly visible. Never guess.` }]
      });
      fillIpo(r.json);
      Q.toast('Details filled', 'Check the numbers against your photo, then press Check this IPO.');
    } catch (err) { Q.fail(err); }
    finally { Q.busy(btn, false); }
  });
  function fillIpo(j) {
    const set = (id, v) => { if (v != null && v !== '') $(id).value = v; };
    set('i-name', j.company); set('i-price', j.price_band_high ?? j.price); set('i-lot', j.lot_size);
    set('i-size', j.issue_size_cr); set('i-fresh', j.fresh_issue_cr ?? (j.issue_size_cr != null && j.ofs_cr != null ? Math.max(0, j.issue_size_cr - j.ofs_cr) : null));
    set('i-pe', j.pe); set('i-peer', j.peer_pe); set('i-retail', j.retail_times); set('i-qib', j.qib_times);
    if (j.close_date && /^\d{4}-\d{2}-\d{2}$/.test(j.close_date)) $('i-close').value = j.close_date;
  }
  $('ipo-clear').addEventListener('click', () => { setTimeout(() => { $('ipo-result').innerHTML = '<div class="empty" style="padding:20px 8px"><h3>Fill in what you know</h3><p>Even the price and lot size are enough to see how much you need.</p></div>'; }, 0); });

  let lastIpo = null;
  $('ipo-form').addEventListener('submit', e => {
    e.preventDefault();
    const v = id => { const x = parseFloat($(id).value); return isFinite(x) && x > 0 ? x : null; };
    const d = { name: $('i-name').value.trim(), price: v('i-price'), lot: v('i-lot'), size: v('i-size'), fresh: $('i-fresh').value === '' ? null : Math.max(0, +$('i-fresh').value),
      pe: v('i-pe'), peer: v('i-peer'), retail: v('i-retail'), qib: v('i-qib'), close: $('i-close').value };
    if (!d.price || !d.lot) { Q.toast('Price and lot size needed', 'Enter at least the upper price band and the lot size.', 'bad'); ($('i-price').value ? $('i-lot') : $('i-price')).focus(); return; }
    lastIpo = d;
    renderIpo(d);
  });
  function renderIpo(d) {
    const one = d.price * d.lot, maxLots = Math.max(1, Math.floor(200000 / one));
    const checks = [];
    const add = (kind, title, text) => checks.push(`<li><span class="status ${kind}">${{ ok: 'Looks fine', warn: 'Be careful', bad: 'High risk', info: 'Good to know' }[kind]}</span><b>${title}</b><p>${text}</p></li>`);
    if (d.retail != null) {
      d.retail <= 1 ? add('ok', 'Shares for every retail applicant', `The ${term('retail', 'retail')} part is subscribed ${d.retail} times, so applicants should get shares.`)
        : add('info', `About 1 in ${Math.round(d.retail)} gets shares`, `The retail part is ${term('subscription', 'subscribed')} ${d.retail} times. ${term('allotment', 'Allotment')} is a lottery: lucky applicants get one ${term('lot', 'lot')}. Applying for more lots barely raises your chance.`);
    }
    if (d.size && d.fresh != null) {
      const f = Math.min(100, d.fresh / d.size * 100);
      f < 30 ? add('warn', `Mostly owners selling (${(100 - f).toFixed(0)}% OFS)`, `Most of the money goes to existing owners through the ${term('ofs', 'offer for sale')}, not into the company. Read why they are selling in the ${term('rhp', 'RHP')}.`)
        : f > 70 ? add('ok', `Money mostly goes to the company (${f.toFixed(0)}%)`, `It is mostly a ${term('fresh-issue', 'fresh issue')}: the company gets the money to grow or repay loans.`)
          : add('info', `A mix: ${f.toFixed(0)}% to the company`, `Part ${term('fresh-issue', 'fresh issue')}, part ${term('ofs', 'OFS')} (owners selling).`);
    }
    if (d.pe && d.peer) {
      const x = d.pe / d.peer;
      x > 1.25 ? add('warn', `Priced ${((x - 1) * 100).toFixed(0)}% above similar companies`, `${term('pe', 'P/E')} ${d.pe} against ${d.peer} for similar companies. You pay more for each rupee of profit.`)
        : x < 0.9 ? add('ok', 'Priced below similar companies', `${term('pe', 'P/E')} ${d.pe} against ${d.peer} for similar companies.`)
          : add('ok', 'Priced like similar companies', `${term('pe', 'P/E')} ${d.pe} against ${d.peer} for similar companies.`);
    }
    if (d.qib != null) {
      d.qib >= 10 ? add('ok', 'Big institutions are keen', `${term('qib', 'QIBs')} (mutual funds, banks) applied ${d.qib} times. Professionals looked closely and liked it.`)
        : d.qib >= 1 ? add('info', 'Moderate interest from institutions', `${term('qib', 'QIBs')} applied ${d.qib} times.`)
          : add('warn', 'Institutions held back', `${term('qib', 'QIBs')} did not fully subscribe (${d.qib} times). Professionals were not convinced.`);
    }
    add('info', 'Ignore grey market tips', `${term('gmp', 'GMP')} numbers on social media are unofficial and often wrong. A high GMP does not mean a listing gain.`);
    let deadline = '';
    if (d.close) {
      const days = Q.daysUntil(d.close);
      const title = `Apply for ${d.name || 'IPO'} (last day)`;
      deadline = days < 0 ? Q.notice('warn', `<b>This IPO closed on ${Q.date(d.close)}.</b>`)
        : `<div class="notice" style="margin-bottom:14px"><span class="ic">!</span><div><b>${days === 0 ? 'Closes today' : days === 1 ? 'Closes tomorrow' : `Closes in ${days} days`}</b> (${Q.date(d.close)}). Approve the UPI mandate before 5 pm on the last day.
          <div class="row" style="margin-top:8px"><a class="btn btn-sm" target="_blank" rel="noopener" href="${Q.gcalUrl(title, d.close, 'Approve the UPI mandate before 5 pm.')}">Add to Google Calendar</a><button class="btn btn-sm btn-quiet" type="button" id="ipo-ics">Download reminder</button></div></div></div>`;
    }
    $('ipo-result').innerHTML = `
      <div class="result-title"><h2>${Q.esc(d.name || 'This IPO')}</h2></div>
      <div class="ipo-sum">
        <div><span>Least you need (1 ${term('lot', 'lot')})</span><b>${Q.inr(one)}</b><span>${d.lot} shares × ${Q.inr(d.price, d.price % 1 ? 2 : 0)}</span></div>
        <div><span>Most as a ${term('retail', 'retail investor')}</span><b>${maxLots} lots</b><span>${Q.inr(maxLots * one)}, under the ₹2 lakh retail limit</span></div>
      </div>
      ${deadline}
      <ul class="rules">${checks.join('')}</ul>
      <h3 style="margin:18px 0 8px">How to apply</h3>
      <ol class="steps-list">
        <li>Open your broker or bank app and find the IPO by name.</li>
        <li>Enter your UPI ID, choose the number of lots and tick ${term('cut-off', 'cut-off price')}.</li>
        <li>Approve the ${term('asba', 'UPI mandate')} in your UPI app. Your money is only blocked, not taken.</li>
        <li>After the issue closes, check ${term('allotment', 'allotment')} in your app or on the registrar's website.</li>
        <li>If you get shares they reach your ${term('demat', 'demat account')} before ${term('listing', 'listing day')}, about 3 working days after closing. If not, the block is removed.</li>
      </ol>
      <div class="notice" style="margin-top:14px"><span class="ic">i</span><div>These checks are rules of thumb for learning, not a recommendation to apply.</div></div>
      <div class="row" style="margin-top:14px"><button class="btn btn-app" type="button" id="ipo-ask">Ask Mitra about this IPO</button></div>`;
    $('ipo-ics')?.addEventListener('click', () => Q.icsDownload(`Apply for ${d.name || 'IPO'} (last day)`, d.close, 'Approve the UPI mandate before 5 pm.'));
    $('ipo-ask').addEventListener('click', () => mitraAsk(`Help me understand this IPO as a beginner: ${ipoFacts(d)}. What do these numbers mean and what should I read before applying?`));
    if (innerWidth < 900) $('ipo-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const ipoFacts = d => [d.name && `company ${d.name}`, `upper price ₹${d.price}`, `lot ${d.lot} shares`, d.size && `issue ₹${d.size} crore`, d.fresh != null && `fresh issue ₹${d.fresh} crore`,
    d.pe && `P/E ${d.pe}`, d.peer && `peer P/E ${d.peer}`, d.retail != null && `retail subscribed ${d.retail}x`, d.qib != null && `QIB subscribed ${d.qib}x`].filter(Boolean).join(', ');

  $('ipo-live').addEventListener('click', async e => {
    const out = $('ipo-live-out'), btn = e.currentTarget;
    Q.busy(btn, true, 'Searching…');
    try {
      const r = await Q.gemini({
        search: true, json: true, temperature: 0.1,
        prompt: `Today is ${new Date().toDateString()}. Using Google Search, list mainboard IPOs in India that are open now or open in the next 14 days. Return only a JSON array:
[{"company": string, "open_date": "YYYY-MM-DD"|null, "close_date": "YYYY-MM-DD"|null, "price_band": string|null, "price_band_high": number|null, "lot_size": number|null, "status": "open"|"upcoming"}]
Only include facts found in search results. Return [] if none.`
      });
      const list = Array.isArray(r.json) ? r.json : [];
      out.innerHTML = list.length ? `<ul class="list live-list">${list.map((x, i) => `<li><b>${Q.esc(x.company)}</b><span class="small">${x.status === 'open' ? 'Open now' : 'Upcoming'}${x.open_date ? `, ${Q.date(x.open_date)} to ${x.close_date ? Q.date(x.close_date) : '?'}` : ''}${x.price_band ? `, price ${Q.esc(x.price_band)}` : ''}${x.lot_size ? `, lot ${x.lot_size}` : ''}</span><div><button class="btn btn-sm" type="button" data-use="${i}">Check this one</button></div></li>`).join('')}</ul>`
        : '<p class="muted">No open or upcoming mainboard IPOs found right now.</p>';
      out.innerHTML += r.sources.length ? `<p class="sources">Found on: ${r.sources.slice(0, 5).map(s => `<a href="${Q.esc(s.url)}" target="_blank" rel="noopener">${Q.esc(s.title)}</a>`).join(', ')}. Confirm dates on the NSE list before applying.</p>` : '';
      out.onclick = ev => {
        const b = ev.target.closest('[data-use]'); if (!b) return;
        const x = list[+b.dataset.use];
        $('ipo-form').reset();
        fillIpo({ company: x.company, price_band_high: x.price_band_high, lot_size: x.lot_size, close_date: x.close_date });
        $('i-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
        Q.toast('Filled in', 'Add subscription and P/E details if you have them, then press Check this IPO.');
      };
    } catch (err) {
      if (err.code === 'SEARCH_UNAVAILABLE') out.innerHTML = Q.notice('warn', `<b>Live search needs a paid Gemini plan.</b> Open the <a href="https://www.nseindia.com/market-data/all-upcoming-issues-ipo" target="_blank" rel="noopener">official NSE IPO list</a>, then type the details here or use <b>Fill from a photo</b>.`);
      else Q.fail(err, out);
    } finally { Q.busy(btn, false); }
  });

  /* =================== words explained =================== */
  function renderWords() {
    const q = $('w-search').value.trim().toLowerCase();
    const list = D.GLOSSARY.filter(g => !q || [g.term, ...g.aka, g.meaning].some(s => s.toLowerCase().includes(q)));
    const lang = Q.lang(), other = lang !== 'en';
    $('words-count').textContent = `${list.length} of ${D.GLOSSARY.length} words`;
    $('words').innerHTML = list.length ? list.map(g => `<li id="w-${g.key}"><h4>${Q.esc(g.term)}</h4><p>${Q.esc(g.meaning)}</p><p class="ex">${Q.esc(g.example)}</p>
      <div class="ai-x" hidden></div>
      <div class="row">${other ? `<button class="btn btn-sm" type="button" data-explain="${g.key}">Explain in ${Q.esc(Q.LANGS[lang].label)}</button>` : ''}<button class="btn btn-sm btn-quiet" type="button" data-askw="${g.key}">Ask Mitra</button></div></li>`).join('')
      : `<li class="empty" style="grid-column:1/-1"><h3>No word matches "${Q.esc(q)}"</h3><p>Ask Mitra instead: it can explain any money word.</p></li>`;
  }
  $('w-search').addEventListener('input', renderWords);
  $('words').addEventListener('click', async e => {
    const a = e.target.closest('[data-askw]');
    if (a) return mitraAsk(`Explain "${D.byKey[a.dataset.askw].term}" with a simple example.`);
    const x = e.target.closest('[data-explain]'); if (!x) return;
    const g = D.byKey[x.dataset.explain], box = x.closest('li').querySelector('.ai-x');
    Q.busy(x, true);
    try {
      const r = await Q.gemini({ prompt: `Explain the stock-market word "${g.term}" to a beginner in India in ${Q.langPrompt()}. Two or three short sentences and one example in rupees. Meaning in English for reference: ${g.meaning}`, temperature: 0.3 });
      box.innerHTML = Q.md(r.text); box.hidden = false;
    } catch (err) { Q.fail(err, box); box.hidden = false; }
    finally { Q.busy(x, false); }
  });
  document.addEventListener('quadrant:lang', () => { renderWords(); renderQuick(); });
  renderWords();

  /* =================== Mitra =================== */
  const history = [];
  const AI = () => !!Q.key('GEMINI_API_KEY');
  const system = () => `You are Mitra, a friendly teacher inside StockMitra, an app for first-time investors in India.
Explain money and stock-market words in very simple language that a 16-year-old can follow, with a small example in rupees.
Keep answers under 120 words unless the user asks for more. Use short paragraphs or a short list.
Reply in ${Q.langPrompt()}.
Never tell the user to buy or sell a particular share or IPO, never predict prices and never promise returns.
If asked what to buy, explain how a beginner can decide: emergency fund first, only money not needed for 5+ years, spread money out (index funds), invest monthly (SIP), and see a SEBI-registered investment adviser for personal advice.
Warn about scams when relevant: guaranteed returns, tips on Telegram or WhatsApp, anyone asking for an OTP or demat password.
${stockFacts()}`;

  function addMsg(kind, html) {
    const el = document.createElement('div'); el.className = 'msg ' + kind; el.innerHTML = html;
    $('mitra-log').appendChild(el); $('mitra-log').scrollTop = $('mitra-log').scrollHeight;
    return el;
  }
  function renderQuick() {
    const qs = cur ? [`Explain ${cur.name}'s numbers`, 'What is a SIP?', 'What does P/E mean?', 'Is it safe to buy at a 52-week high?']
      : ['What is an IPO?', 'What is a SIP?', 'What does P/E mean?', 'How do I start with ₹1,000?'];
    $('mitra-quick').innerHTML = qs.map(q => `<button class="chip" type="button">${Q.esc(q)}</button>`).join('');
  }
  function openMitra() {
    $('mitra').hidden = false; $('mitra-fab').hidden = true; $('mitra-fab').setAttribute('aria-expanded', 'true');
    $('mitra-mode').textContent = AI() ? 'AI helper' : 'Word list mode (add a Gemini key for full answers)';
    if (!$('mitra-log').children.length) addMsg('bot', `<p>Hi, I'm Mitra. Ask me any money word, like SIP or P/E, or how IPOs work. I explain things; I never give buy or sell tips.</p>`);
    renderQuick();
    setTimeout(() => $('mitra-q').focus(), 50);
  }
  function closeMitra() { $('mitra').hidden = true; $('mitra-fab').hidden = false; $('mitra-fab').setAttribute('aria-expanded', 'false'); $('mitra-fab').focus(); }
  $('mitra-fab').addEventListener('click', openMitra);
  $('mitra-close').addEventListener('click', closeMitra);
  $('mitra-quick').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    mitraAsk(b.textContent.startsWith('Explain ') && cur ? `I'm a beginner looking at ${cur.name}. Explain what its numbers mean for me.` : b.textContent);
  });
  $('mitra-form').addEventListener('submit', e => { e.preventDefault(); const q = $('mitra-q').value.trim(); if (q) { $('mitra-q').value = ''; mitraAsk(q); } });

  function offlineAnswer(q) {
    const found = D.findTerms(q).slice(0, 2);
    if (found.length) return found.map(g => `<p><b>${Q.esc(g.term)}</b>: ${Q.esc(g.meaning)}</p><p class="small">Example: ${Q.esc(g.example)}</p>`).join('')
      + '<p class="small muted">From the built-in word list. Add a Gemini key in config.js for answers to any question.</p>';
    return `<p>Without the AI I can explain these words: ${D.GLOSSARY.slice(0, 12).map(g => Q.esc(g.term.split(' (')[0])).join(', ')} and more in <b>Words explained</b>.</p><p class="small muted">For any other question, add your Gemini key in config.js.</p>`;
  }
  async function mitraAsk(q) {
    openMitra();
    addMsg('me', Q.esc(q));
    const typing = addMsg('bot typing', 'Mitra is thinking…');
    if (!AI()) { typing.remove(); addMsg('bot', offlineAnswer(q)); return; }
    history.push({ role: 'user', parts: [{ text: q }] });
    try {
      const r = await Q.gemini({ contents: history.slice(-11), system: system(), temperature: 0.5 });
      history.push({ role: 'model', parts: [{ text: r.text }] });
      typing.remove(); addMsg('bot', Q.md(r.text));
    } catch (err) {
      history.pop(); typing.remove();
      addMsg('bot', `<p><b>${Q.esc(err.title || 'Problem')}.</b> ${Q.esc(err.message)}</p>` + (D.findTerms(q).length ? offlineAnswer(q) : ''));
    }
  }
  window.mitraAsk = mitraAsk; // handy for teammates testing in the console
})();

/* =========================================================
   Quadrant shared runtime (plain JavaScript, no build step)
   - top bar, toasts, storage, language
   - Gemini helper (keys come from config.js)
   - photo capture: live camera with upload fallback
   - place picker: GPS with "type your town" fallback
   - weather, speech, calendar reminders, tiny markdown
   Works when index.html is double-clicked (file://) and on
   Live Server / GitHub Pages. Classic script on purpose:
   ES modules do not load from file:// in Chrome.
   ========================================================= */
(function () {
  'use strict';
  const Q = {};
  const CFG = window.QUADRANT_CONFIG || {};
  Q.key = name => String(CFG[name] || '').trim();
  Q.isFile = location.protocol === 'file:';

  Q.APPS = [
    { id: 'stockmitra',  name: 'StockMitra',   short: 'Stocks', color: 'var(--stock)', what: 'Stocks and IPOs for beginners' },
    { id: 'paperhelper', name: 'Paper Helper', short: 'Papers', color: 'var(--paper)', what: 'Any letter, bill or form, explained' },
    { id: 'fixitlens',   name: 'FixIt Lens',   short: 'FixIt', color: 'var(--fixit)', what: 'Photo of a problem, the fix and who to call' },
    { id: 'freshkeep',   name: 'FreshKeep',    short: 'Fresh', color: 'var(--fresh)', what: 'How long your food lasts, what to cook first' }
  ];

  /* The Quadrant mark: four quarter-circles, one per app (top-left, top-right, bottom-left, bottom-right) */
  const PIECES = [
    'M14.8 14.8V2.05A14 14 0 0 0 2.05 14.8Z',
    'M17.2 14.8H29.95A14 14 0 0 0 17.2 2.05Z',
    'M14.8 17.2H2.05A14 14 0 0 0 14.8 29.95Z',
    'M17.2 17.2V29.95A14 14 0 0 0 29.95 17.2Z'
  ];
  Q.mark = (active) => `<svg viewBox="0 0 32 32" aria-hidden="true">${Q.APPS.map((a, i) =>
    `<path d="${PIECES[i]}" fill="${a.color}" opacity="${!active || active === a.id ? 1 : .28}"/>`).join('')}</svg>`;

  /* ---------- small helpers ---------- */
  Q.$ = id => document.getElementById(id);
  Q.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  Q.load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  Q.save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  Q.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  Q.inr = (n, d = 0) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  Q.num = (n, d = 1) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  Q.pct = (n, d = 1) => (n > 0 ? '+' : '') + Number(n).toFixed(d) + '%';
  Q.date = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  /** Whole calendar days from today until a YYYY-MM-DD date (0 = today, negative = past). */
  Q.daysUntil = ymd => { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(ymd + 'T00:00:00') - t) / 864e5); };
  Q.inDays = n => n < 0 ? 'This date has passed' : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
  Q.busy = (btn, on, text) => {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.innerHTML; btn.classList.add('loading'); if (text) btn.textContent = text; }
    else { btn.classList.remove('loading'); if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
  };

  Q.toast = function (title, msg, type) {
    let box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (type || '');
    t.innerHTML = '<b></b><span></span>';
    t.querySelector('b').textContent = title; t.querySelector('span').textContent = msg || '';
    box.appendChild(t);
    setTimeout(() => t.remove(), type === 'bad' ? 7000 : 4000);
  };
  /** Show any error from the helpers below in a consistent way. */
  Q.fail = (err, where) => {
    console.warn(err);
    const title = err.title || 'Something went wrong';
    if (where) where.innerHTML = Q.notice('bad', `<b>${Q.esc(title)}.</b> ${Q.esc(err.message)}`);
    else Q.toast(title, err.message, 'bad');
  };
  Q.notice = (kind, html) => `<div class="notice ${kind}"><span class="ic">${{ ok: '✓', warn: '!', bad: '✕' }[kind] || 'i'}</span><div>${html}</div></div>`;

  /* ---------- language for AI answers ---------- */
  Q.LANGS = {
    en: { label: 'English', speech: 'en-IN', prompt: 'simple English' },
    te: { label: 'తెలుగు Telugu', speech: 'te-IN', prompt: 'Telugu (in Telugu script, simple everyday words)' },
    hi: { label: 'हिन्दी Hindi', speech: 'hi-IN', prompt: 'Hindi (in Devanagari script, simple everyday words)' },
    ta: { label: 'தமிழ் Tamil', speech: 'ta-IN', prompt: 'Tamil (in Tamil script, simple everyday words)' },
    kn: { label: 'ಕನ್ನಡ Kannada', speech: 'kn-IN', prompt: 'Kannada (in Kannada script, simple everyday words)' }
  };
  Q.lang = () => { const l = Q.load('quadrant.lang', 'en'); return Q.LANGS[l] ? l : 'en'; };
  Q.langPrompt = () => Q.LANGS[Q.lang()].prompt;

  /* ---------- top bar (every page calls Q.shell) ---------- */
  Q.shell = function (active, base) {
    base = base == null ? '../' : base;
    const bar = document.createElement('header');
    bar.className = 'topbar';
    const ai = Q.key('GEMINI_API_KEY');
    bar.innerHTML = `
      <a class="brand" href="../index.html">${Q.mark(active)}Akhil Apps</a>
      <nav class="app-tabs" aria-label="Apps">${Q.APPS.map(a =>
        `<a href="${base}${a.id}/index.html"${a.id === active ? ' aria-current="page"' : ''}><span class="q" style="background:${a.color}"></span><span class="long">${a.name}</span><span class="short">${a.short}</span></a>`).join('')}</nav>
      <div class="top-tools">
        <label class="lang-pick"><span>AI answers in</span>
          <select id="lang-select" aria-label="Language for AI answers">${Object.entries(Q.LANGS).map(([k, v]) => `<option value="${k}"${k === Q.lang() ? ' selected' : ''}>${v.label}</option>`).join('')}</select></label>
        <a class="key-chip${ai ? '' : ' missing'}" href="../index.html#akhil" title="${ai ? 'Gemini key found in config.js' : 'Add your Gemini key in config.js'}"><i></i><span>${ai ? 'AI ready' : 'AI key missing'}</span></a>
      </div>`;
    document.body.prepend(bar);
    Q.$('lang-select').addEventListener('change', e => {
      Q.save('quadrant.lang', e.target.value);
      document.dispatchEvent(new CustomEvent('quadrant:lang', { detail: e.target.value }));
      Q.toast('Language changed', `New AI answers will be in ${Q.LANGS[e.target.value].label}.`);
    });
  };

  /** Explain file:// limits once, inside the page, where camera or GPS is used. */
  Q.fileNotice = function (el, what) {
    if (!Q.isFile || !el) return;
    el.innerHTML = Q.notice('warn', `<b>Opened as a file.</b> If the browser blocks the ${what}, upload a photo or type your town instead. For full camera and GPS access, open the folder in VS Code and click <b>Go Live</b> (Live Server), or use your GitHub Pages link.`);
    el.hidden = false;
  };

  /* =========================================================
     Gemini
     ========================================================= */
  class QError extends Error { constructor(title, message, code) { super(message); this.title = title; this.code = code; } }
  Q.QError = QError;
  const GEMINI = 'https://generativelanguage.googleapis.com';
  let workingModel = null;
  // If the first model is busy or not available to this key, the next ones are tried in order.
  const models = () => [Q.key('GEMINI_MODEL') || 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash']
    .filter((m, i, a) => a.indexOf(m) === i);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* Read Gemini's JSON even if it slipped in comments, trailing commas or a code fence. */
  function looseJSON(t) {
    let out = '', inStr = false, esc = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i], n = t[i + 1];
      if (inStr) { out += c; if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') { inStr = true; out += c; continue; }
      if (c === '/' && n === '/') { while (i < t.length && t[i] !== '\n') i++; out += '\n'; continue; }
      if (c === '/' && n === '*') { i += 2; while (i < t.length && !(t[i] === '*' && t[i + 1] === '/')) i++; i++; continue; }
      if (c === ',') { let j = i + 1; while (/\s/.test(t[j] || '')) j++; if (t[j] === '}' || t[j] === ']') continue; }
      out += c;
    }
    return out;
  }
  Q.parseJSON = function (text) {
    const t = String(text).replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
    const tries = [t];
    const a = Math.min(...['{', '['].map(c => t.indexOf(c)).filter(i => i >= 0));
    const b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (isFinite(a) && b > a) tries.push(t.slice(a, b + 1));
    for (const x of tries) { try { return JSON.parse(x); } catch (e) { /* next */ } }
    for (const x of tries) { try { return JSON.parse(looseJSON(x)); } catch (e) { /* next */ } }
    return null;
  };

  /* Answer layouts for Gemini (structured output): it must reply in exactly this shape. */
  const T = (type, extra) => Object.assign({ type }, extra);
  Q.S = {
    str: desc => T('STRING', desc ? { description: desc } : {}),
    num: desc => T('NUMBER', desc ? { description: desc } : {}),
    bool: () => T('BOOLEAN'),
    oneOf: values => T('STRING', { enum: values }),
    list: items => T('ARRAY', { items }),
    obj: props => T('OBJECT', { properties: props, required: Object.keys(props) }),
    maybe: sch => Object.assign({}, sch, { nullable: true })
  };

  /**
   * Ask Gemini. Pass either `prompt` (text), `parts` (text + images) or a full `contents` history.
   * json: true asks for a JSON answer and parses it. search: true lets Gemini use Google Search
   * (paid Gemini plans only; callers must handle code 'SEARCH_UNAVAILABLE').
   */
  Q.gemini = async function (opts) {
    const { prompt, parts, system, json = false, search = false, schema = null, temperature = 0.4, again = false } = opts;
    let { contents } = opts;
    const key = Q.key('GEMINI_API_KEY');
    if (!key) throw new QError('Gemini key missing', 'Open config.js in VS Code, paste your key between the quotes after GEMINI_API_KEY, save, and refresh this page.', 'NO_KEY');
    contents = contents || [{ role: 'user', parts: parts || [{ text: prompt }] }];
    const body = { contents, generationConfig: { temperature } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    if (json && !search) body.generationConfig.responseMimeType = 'application/json';
    if (json && !search && schema) body.generationConfig.responseSchema = schema;
    if (search) body.tools = [{ google_search: {} }];

    const list = workingModel ? [workingModel, ...models().filter(m => m !== workingModel)] : models();
    let trouble = null;   // 'busy' or 'quota' if every model was busy or out of free requests
    for (const [i, model] of list.entries()) {
      for (let attempt = 0; attempt < (i === 0 ? 2 : 1); attempt++) {   // the first model gets one quick retry
        let res;
        try {
          res = await fetch(`${GEMINI}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body)
          });
        } catch (e) {
          throw new QError('Could not reach Google Gemini', navigator.onLine === false
            ? 'You are offline. Connect to the internet and try again.'
            : Q.isFile ? 'Check your internet. If it still fails, open the folder in VS Code and click Go Live (Live Server), then try again.'
              : 'Check your internet connection and try again.', 'NETWORK');
        }
        const data = await res.json().catch(() => ({}));
        const msg = String(data?.error?.message || res.statusText || '');
        if (res.ok) {
          workingModel = model;
          const cand = data.candidates?.[0];
          const text = (cand?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('').trim();
          if (!text) throw new QError('No answer', cand?.finishReason === 'SAFETY' ? 'Gemini would not answer this. Try a different photo or question.' : 'Gemini returned an empty answer. Try again.', 'EMPTY');
          const sources = (cand.groundingMetadata?.groundingChunks || []).map(c => c.web).filter(w => w && w.uri).map(w => ({ url: w.uri, title: w.title || w.uri }));
          let parsed = null;
          if (json) {
            parsed = Q.parseJSON(text);
            if (!parsed || typeof parsed !== 'object') {
              console.warn('Gemini answer that could not be read:', cand?.finishReason, text.slice(0, 2000));
              if (!again) return Q.gemini({ ...opts, temperature: 0, again: true });   // one automatic retry
              const cut = cand?.finishReason === 'MAX_TOKENS';
              const said = text.replace(/\s+/g, ' ').slice(0, 160);
              throw new QError('Unreadable answer', cut
                ? 'The answer was cut off, which can happen with very long documents. Try only the important pages (photos of 1 to 3 pages).'
                : `Gemini's reply was not in the expected format, even after a second try. Try again, or use photos instead of a PDF.${said ? ` Gemini said: "${said}${text.length > 160 ? '…' : ''}"` : ''}`, 'BAD_JSON');
            }
          }
          return { text, json: parsed, sources, model };
        }
        // Google's servers are overloaded ("high demand"): wait a moment, then try another model
        if (res.status === 503 || res.status === 500 || res.status === 504 || /high demand|overloaded|temporarily unavailable/i.test(msg)) {
          trouble = 'busy';
          if (attempt === 0 && i === 0) { await sleep(1500); continue; }
          break;
        }
        // an older model that does not accept the answer layout: drop the layout and ask the same model again
        if (res.status === 400 && body.generationConfig.responseSchema && /schema|response_?schema|unknown name|invalid json payload|enum|nullable/i.test(msg)) {
          delete body.generationConfig.responseSchema; attempt--; continue;
        }
        // free requests used up: each model has its own free limit, so try the next one
        if (res.status === 429) { if (trouble !== 'busy') trouble = 'quota'; break; }
        // model retired or not available to this key: try the next one
        if (res.status === 404 || ((res.status === 400 || res.status === 403) && /model/i.test(msg) && /not (found|supported|available)|unsupported|invalid|access|permission/i.test(msg))) break;
        if (search) throw new QError('Live search not available', 'Google Search inside Gemini needs a paid Gemini plan. Use the official links below, or fill the details yourself.', 'SEARCH_UNAVAILABLE');
        if (res.status === 400 && /api key/i.test(msg)) throw new QError('Gemini key not accepted', 'The key in config.js is not valid. Copy it again from aistudio.google.com/apikey, with no spaces.', 'BAD_KEY');
        if (res.status === 401) throw new QError('Gemini key not accepted', 'Copy the key again from aistudio.google.com/apikey into config.js. New keys start with "AQ."; if a fresh key still fails, it is a Google account issue, not this app.', 'BAD_KEY');
        if (res.status === 403) throw new QError('Key cannot use Gemini', 'Create the key in Google AI Studio (aistudio.google.com/apikey) and paste it into config.js.', 'FORBIDDEN');
        if (res.status === 413) throw new QError('Too large', 'The photos are too large. Use fewer pages.', 'TOO_LARGE');
        throw new QError('Gemini error', msg || `Request failed (${res.status}).`, 'ERROR');
      }
    }
    if (search && trouble) throw new QError('Live search not available', 'Google Search inside Gemini is busy or needs a paid Gemini plan. Use the official links below, or fill the details yourself.', 'SEARCH_UNAVAILABLE');
    if (trouble === 'busy') throw new QError('Gemini is busy right now', 'Google\'s AI servers are overloaded for every model this app can use. This usually clears in a few minutes. Wait a little, then press the button again.', 'BUSY');
    if (trouble === 'quota') throw new QError('Free limit reached', 'Your Gemini key has used its free requests for now. Wait a minute and try again; if it keeps happening, the daily free limit is used up until tomorrow.', 'QUOTA');
    throw new QError('Model not available', `None of these Gemini models worked with your key: ${list.join(', ')}. Put a model name from Google AI Studio in GEMINI_MODEL in config.js.`, 'NO_MODEL');
  };

  /* =========================================================
     Photos: resize in the browser, then send as Gemini parts
     ========================================================= */
  function drawScaled(src, max) {
    const w = src.videoWidth || src.naturalWidth || src.width, h = src.videoHeight || src.naturalHeight || src.height;
    const k = Math.min(1, max / Math.max(w, h));
    const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return c;
  }
  const toPart = (canvas, q = 0.86) => ({ inline_data: { mime_type: 'image/jpeg', data: canvas.toDataURL('image/jpeg', q).split(',')[1] } });
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => { resolve(img); setTimeout(() => URL.revokeObjectURL(url), 1000); };
      img.onerror = () => reject(new QError('Photo not readable', 'This file could not be opened as a photo. Use a JPG or PNG.'));
      img.src = url;
    });
  }
  function readBase64(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1]);
      r.onerror = () => reject(new QError('File not readable', 'This file could not be read.'));
      r.readAsDataURL(file);
    });
  }
  /** File (image or PDF) -> { part, thumb, name, kind } */
  Q.filePart = async function (file, { max = 1600, pdf = false } = {}) {
    if (pdf && file.type === 'application/pdf') {
      if (file.size > 14 * 1024 * 1024) throw new QError('PDF too large', 'Use a PDF smaller than 14 MB, or take photos of the pages.');
      return { part: { inline_data: { mime_type: 'application/pdf', data: await readBase64(file) } }, thumb: null, name: file.name, kind: 'pdf' };
    }
    if (!/^image\//.test(file.type)) throw new QError('Not a photo', pdf ? 'Choose a photo (JPG, PNG) or a PDF.' : 'Choose a photo (JPG or PNG).');
    const img = await loadImage(file);
    return { part: toPart(drawScaled(img, max)), thumb: drawScaled(img, 320).toDataURL('image/jpeg', .7), name: file.name, kind: 'image' };
  };

  const CAM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>';

  /**
   * Photo taker: live camera (when the browser allows it) plus "Upload" that always works.
   * new Q.Shots(element, { max, pdf, hint, onChange(items) }); shots.items -> [{ part, thumb, name, kind }]
   */
  Q.Shots = class {
    constructor(root, { max = 1, pdf = false, hint = '', title = 'Add a photo', onChange } = {}) {
      Object.assign(this, { root, max, pdf, onChange, items: [], stream: null, facing: 'environment' });
      root.classList.add('shots');
      root.innerHTML = `
        <div class="viewer">
          <video playsinline muted hidden></video>
          <img class="preview" alt="" hidden>
          <div class="viewer-empty">${CAM_ICON}<b>${Q.esc(title)}</b><span class="small">${Q.esc(hint)}</span></div>
        </div>
        <div class="shots-bar">
          <button class="btn btn-app" type="button" data-act="cam">${CAM_ICON}Open camera</button>
          <button class="btn btn-app" type="button" data-act="snap" hidden>Take photo</button>
          <button class="btn btn-quiet" type="button" data-act="flip" hidden>Switch camera</button>
          <button class="btn btn-quiet" type="button" data-act="close" hidden>Close camera</button>
          <label class="btn">Upload ${pdf ? 'photo or PDF' : 'photo'}<input type="file" hidden accept="${pdf ? 'image/*,application/pdf' : 'image/*'}" ${max > 1 ? 'multiple' : ''}></label>
        </div>
        <ul class="thumbs" aria-label="Added photos"></ul>`;
      this.video = root.querySelector('video');
      this.preview = root.querySelector('img.preview');
      this.empty = root.querySelector('.viewer-empty');
      root.querySelector('[data-act=cam]').addEventListener('click', () => this.start());
      root.querySelector('[data-act=snap]').addEventListener('click', () => this.snap());
      root.querySelector('[data-act=flip]').addEventListener('click', () => { this.facing = this.facing === 'environment' ? 'user' : 'environment'; this.start(); });
      root.querySelector('[data-act=close]').addEventListener('click', () => this.stop());
      root.querySelector('input[type=file]').addEventListener('change', e => { this.addFiles([...e.target.files]); e.target.value = ''; });
      const viewer = root.querySelector('.viewer');
      viewer.addEventListener('dragover', e => { e.preventDefault(); viewer.classList.add('drag'); });
      viewer.addEventListener('dragleave', () => viewer.classList.remove('drag'));
      viewer.addEventListener('drop', e => { e.preventDefault(); viewer.classList.remove('drag'); this.addFiles([...e.dataTransfer.files]); });
      root.querySelector('.thumbs').addEventListener('click', e => { const b = e.target.closest('[data-del]'); if (b) { this.items.splice(+b.dataset.del, 1); this.render(); } });
      addEventListener('pagehide', () => this.stop());
    }
    toggle(live) {
      const q = s => this.root.querySelector(s);
      q('[data-act=cam]').hidden = live; q('[data-act=snap]').hidden = !live; q('[data-act=close]').hidden = !live;
      this.video.hidden = !live;
    }
    async start() {
      if (this.items.length >= this.max) { this.items = this.max === 1 ? [] : this.items; if (this.items.length >= this.max) return Q.toast('Enough photos', `You can add up to ${this.max}. Remove one to take another.`); }
      if (!navigator.mediaDevices?.getUserMedia) return this.camError({ name: 'NotSupported' });
      this.stop(true);
      try {
        try { this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: this.facing }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }); }
        catch (e1) { if (e1.name === 'NotAllowedError' || e1.name === 'SecurityError') throw e1; this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); }
      } catch (e) { return this.camError(e); }
      this.video.srcObject = this.stream;
      await this.video.play().catch(() => {});
      this.preview.hidden = true; this.empty.hidden = true; this.toggle(true);
      const cams = (await navigator.mediaDevices.enumerateDevices().catch(() => [])).filter(d => d.kind === 'videoinput');
      this.root.querySelector('[data-act=flip]').hidden = cams.length < 2;
    }
    camError(e) {
      const m = {
        NotAllowedError: ['Camera blocked', Q.isFile ? 'The browser blocked the camera for a file page. Use Upload, or open the folder with VS Code Live Server (Go Live).' : 'Click the camera icon in the address bar, allow the camera, then try again. Or use Upload.'],
        SecurityError: ['Camera blocked', 'Use Upload, or open the folder with VS Code Live Server (Go Live).'],
        NotFoundError: ['No camera found', 'Use Upload to choose a photo instead.'],
        NotReadableError: ['Camera is busy', 'Close other apps or tabs using the camera (Zoom, WhatsApp), then try again.'],
        NotSupported: ['Camera not available here', 'Use Upload to choose or take a photo.']
      }[e.name] || ['Camera did not start', (e.message || '') + ' Use Upload instead.'];
      Q.toast(m[0], m[1], 'bad');
    }
    stop(keepUi) {
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
      this.stream = null; this.video.srcObject = null;
      if (!keepUi) { this.toggle(false); this.root.querySelector('[data-act=flip]').hidden = true; this.showLatest(); }
    }
    snap() {
      if (!this.stream || !this.video.videoWidth) return;
      const big = drawScaled(this.video, 1600), small = drawScaled(this.video, 320);
      if (this.max === 1) this.items = [];
      this.items.push({ part: toPart(big), thumb: small.toDataURL('image/jpeg', .7), name: 'Camera photo', kind: 'image' });
      if (this.items.length >= this.max) this.stop();
      this.render();
    }
    async addFiles(files) {
      if (this.max === 1) this.items = [];
      for (const f of files.slice(0, this.max - this.items.length)) {
        try { this.items.push(await Q.filePart(f, { pdf: this.pdf })); } catch (e) { Q.fail(e); }
      }
      if (files.length > this.max) Q.toast('Some files skipped', `Up to ${this.max} can be added at once.`);
      this.stop(); this.render();
    }
    showLatest() {
      const last = [...this.items].reverse().find(i => i.thumb);
      this.preview.hidden = !last; if (last) this.preview.src = last.thumb;
      this.empty.hidden = !!last || !!this.stream;
      if (!last && this.items.length) { this.empty.hidden = false; }
    }
    render() {
      this.root.querySelector('.thumbs').innerHTML = this.max === 1 ? '' : this.items.map((it, i) =>
        `<li>${it.thumb ? `<img src="${it.thumb}" alt="Page ${i + 1}">` : `PDF<br>${Q.esc(it.name.slice(0, 14))}`}<button type="button" data-del="${i}" aria-label="Remove ${i + 1}">×</button></li>`).join('');
      if (!this.stream) this.showLatest();
      this.onChange && this.onChange(this.items);
    }
    clear() { this.items = []; this.stop(); this.render(); }
    parts() { return this.items.map(i => i.part); }
  };

  /* =========================================================
     Place: GPS, or type a town (Open-Meteo geocoding, no key)
     ========================================================= */
  Q.place = () => Q.load('quadrant.place', null);
  Q.locate = function () {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) return reject(new QError('Location not available', 'This browser cannot share location. Type your town instead.'));
      navigator.geolocation.getCurrentPosition(
        p => resolve({ name: 'My location', lat: +p.coords.latitude.toFixed(5), lon: +p.coords.longitude.toFixed(5), gps: true }),
        e => reject(new QError(e.code === 1 ? 'Location blocked' : 'Location not found',
          e.code === 1 ? (Q.isFile ? 'The browser blocks location for file pages. Type your town instead, or open the folder with VS Code Live Server (Go Live).' : 'Allow location from the icon in the address bar, or type your town instead.')
            : 'Your device could not find its position. Type your town instead.')),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 });
    });
  };
  Q.searchTown = async function (q) {
    let res;
    try { res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`); }
    catch (e) { throw new QError('Search failed', 'Check your internet connection.'); }
    const d = await res.json().catch(() => ({}));
    return (d.results || []).map(r => ({ name: [r.name, r.admin1, r.country === 'India' ? '' : r.country].filter(Boolean).join(', '), lat: r.latitude, lon: r.longitude }));
  };
  /** Place picker UI. new Q.PlacePicker(el, { onPlace(place) }) */
  Q.PlacePicker = class {
    constructor(root, { onPlace, label = 'Your location' } = {}) {
      Object.assign(this, { root, onPlace });
      root.classList.add('place');
      root.innerHTML = `
        <div class="place-now" hidden><span><span class="muted small">${Q.esc(label)}</span><br><b class="pn-name"></b></span><button class="btn btn-sm btn-quiet" type="button" data-act="change">Change</button></div>
        <div class="place-pick">
          <div class="row"><button class="btn btn-app" type="button" data-act="gps">Use my location</button><span class="muted small">or</span></div>
          <div class="field" style="margin-top:8px"><label for="${this.id = 'town-' + Q.uid()}">Type your town or village</label>
            <input class="input" id="${this.id}" autocomplete="off" placeholder="For example: Kadapa"></div>
          <ul class="suggest" hidden></ul>
        </div>`;
      const input = root.querySelector('input'), list = root.querySelector('.suggest');
      let timer = null, results = [];
      input.addEventListener('input', () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) { list.hidden = true; return; }
        timer = setTimeout(async () => {
          try { results = await Q.searchTown(q); } catch (e) { results = []; }
          list.innerHTML = results.length ? results.map((r, i) => `<li><button type="button" data-i="${i}">${Q.esc(r.name)}</button></li>`).join('') : '<li class="muted small" style="padding:8px 10px">No match. Check the spelling or try a bigger town nearby.</li>';
          list.hidden = false;
        }, 300);
      });
      list.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { this.set(results[+b.dataset.i]); input.value = ''; list.hidden = true; } });
      root.querySelector('[data-act=gps]').addEventListener('click', async e => {
        const btn = e.currentTarget;
        Q.busy(btn, true, 'Finding you…');
        try { this.set(await Q.locate()); } catch (err) { Q.fail(err); } finally { Q.busy(btn, false); }
      });
      root.querySelector('[data-act=change]').addEventListener('click', () => this.show(null));
      this.show(Q.place());
    }
    set(p) { Q.save('quadrant.place', p); this.show(p); this.onPlace && this.onPlace(p); }
    show(p) {
      this.root.querySelector('.place-now').hidden = !p;
      this.root.querySelector('.place-pick').hidden = !!p;
      if (p) this.root.querySelector('.pn-name').textContent = p.gps ? `My location (${p.lat.toFixed(3)}, ${p.lon.toFixed(3)})` : p.name;
    }
    get value() { return Q.place(); }
  };

  /** Current weather + next 3 days (Open-Meteo, free, no key). */
  Q.weather = async function (p) {
    let res;
    try {
      res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&forecast_days=3&timezone=auto`);
    } catch (e) { throw new QError('Weather not available', 'Check your internet connection.'); }
    if (!res.ok) throw new QError('Weather not available', 'The weather service did not answer. Try again in a minute.');
    const d = await res.json();
    const days = d.daily.time.map((t, i) => ({ date: t, max: d.daily.temperature_2m_max[i], min: d.daily.temperature_2m_min[i], rh: d.daily.relative_humidity_2m_mean?.[i] }));
    const avg = days.reduce((s, x) => s + (x.max + x.min) / 2, 0) / days.length;
    return { now: d.current.temperature_2m, rh: d.current.relative_humidity_2m, days, avg: Math.round(avg * 10) / 10 };
  };

  /* ---------- speech ---------- */
  Q.speak = function (text, lang) {
    if (!('speechSynthesis' in window) || !text) return false;
    speechSynthesis.cancel();
    const code = (Q.LANGS[lang || Q.lang()] || Q.LANGS.en).speech;
    const u = new SpeechSynthesisUtterance(text); u.lang = code;
    const v = speechSynthesis.getVoices().find(x => x.lang === code) || speechSynthesis.getVoices().find(x => x.lang.startsWith(code.slice(0, 2)));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
    if (!v && code !== 'en-IN') Q.toast('No voice for this language', 'Install the language voice in your phone or computer speech settings. The text is still shown.');
    return true;
  };
  if ('speechSynthesis' in window) speechSynthesis.getVoices();

  /* ---------- reminders ---------- */
  Q.gcalUrl = (title, ymd, details) => {
    const d = ymd.replace(/-/g, ''), next = new Date(ymd + 'T00:00:00'); next.setDate(next.getDate() + 1);
    const e = next.toISOString().slice(0, 10).replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${d}/${e}&details=${encodeURIComponent(details || '')}`;
  };
  Q.icsDownload = (title, ymd, details) => {
    const d = ymd.replace(/-/g, ''), stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const clean = s => String(s || '').replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Quadrant//EN', 'BEGIN:VEVENT', `UID:${Q.uid()}@quadrant`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${clean(title)}`, `DESCRIPTION:${clean(details)}`,
      'BEGIN:VALARM', 'TRIGGER:-P2D', 'ACTION:DISPLAY', `DESCRIPTION:${clean(title)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: title.replace(/[^\w]+/g, '-').slice(0, 40) + '.ics' });
    document.body.appendChild(a); a.click(); a.remove();
  };

  /* ---------- tiny, safe markdown for AI chat replies ---------- */
  Q.md = function (text) {
    const lines = Q.esc(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split(/\n/);
    let html = '', list = null;
    const close = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of lines) {
      const l = raw.trim();
      const ul = /^[-*•]\s+(.*)/.exec(l), ol = /^\d+[.)]\s+(.*)/.exec(l);
      if (ul || ol) { const t = ul ? 'ul' : 'ol'; if (list !== t) { close(); html += `<${t}>`; list = t; } html += `<li>${(ul || ol)[1]}</li>`; }
      else if (!l) close();
      else { close(); html += `<p>${l}</p>`; }
    }
    close();
    return html;
  };

  window.Q = Q;
})();

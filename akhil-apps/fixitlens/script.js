/* =========================================================
   FixIt Lens
   Photo(s) + a sentence -> Gemini: item, likely problem, safety
   level, steps, parts and cost (India), who to call.
   Nearby help: your location (GPS or town) -> OpenStreetMap shops
   for that trade (Overpass API, free, no key) on a Leaflet map,
   plus a Google Maps search that always works.
   ========================================================= */
(function () {
  'use strict';
  Q.shell('fixitlens');
  const $ = Q.$;
  Q.fileNotice($('file-note'), 'camera or location');

  const flowSteps = [...document.querySelectorAll('#flow li')];
  const flow = n => flowSteps.forEach((li, i) => { li.className = i < n ? 'done' : i === n ? 'now' : ''; });

  /* Trades and the OpenStreetMap tags that find them */
  const TRADES = {
    plumber: { label: 'Plumber', search: 'plumber', tags: ['craft=plumber', 'shop=plumbing', 'shop=bathroom_furnishing', 'shop=hardware'] },
    electrician: { label: 'Electrician', search: 'electrician', tags: ['craft=electrician', 'shop=electrical', 'shop=lighting', 'shop=hardware'] },
    appliance_repair: { label: 'Appliance repair (fan, mixer, cooler, TV)', search: 'appliance repair', tags: ['craft=electronics_repair', 'shop=appliance', 'shop=electronics', 'shop=electrical'] },
    mobile_repair: { label: 'Mobile phone repair', search: 'mobile repair shop', tags: ['shop=mobile_phone', 'craft=electronics_repair', 'shop=electronics'] },
    computer_repair: { label: 'Computer and laptop repair', search: 'laptop repair', tags: ['shop=computer', 'craft=electronics_repair'] },
    bike_mechanic: { label: 'Bike and scooter mechanic', search: 'two wheeler mechanic', tags: ['shop=motorcycle_repair', 'shop=motorcycle', 'shop=tyres'] },
    car_mechanic: { label: 'Car mechanic', search: 'car mechanic', tags: ['shop=car_repair', 'shop=car_parts', 'shop=tyres'] },
    bicycle_repair: { label: 'Cycle repair', search: 'cycle repair shop', tags: ['shop=bicycle'] },
    carpenter: { label: 'Carpenter', search: 'carpenter', tags: ['craft=carpenter', 'shop=furniture', 'shop=hardware'] },
    tailor: { label: 'Tailor', search: 'tailor', tags: ['craft=tailor', 'shop=tailor'] },
    cobbler: { label: 'Cobbler (shoes, bags)', search: 'cobbler shoe repair', tags: ['craft=shoemaker', 'shop=shoe_repair', 'shop=shoes'] },
    hardware_shop: { label: 'Hardware shop (parts)', search: 'hardware shop', tags: ['shop=hardware', 'shop=doityourself'] }
  };
  $('trade').innerHTML = Object.entries(TRADES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('');

  /* ---------- photos + voice ---------- */
  const shots = new Q.Shots($('shots'), {
    max: 3, title: 'Photo of the problem',
    hint: 'Get close to the broken part. Add a second photo of the whole thing or its label.',
    onChange: items => { $('fix-btn').disabled = !items.length; flow(items.length ? 1 : 0); }
  });
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const mic = $('mic'); mic.hidden = false;
    let rec = null;
    mic.addEventListener('click', () => {
      if (rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = Q.LANGS[Q.lang()].speech; rec.interimResults = false;
      rec.onresult = e => { const t = [...e.results].map(r => r[0].transcript).join(' '); $('what').value = ($('what').value + ' ' + t).trim(); };
      rec.onerror = e => Q.toast('Could not hear you', e.error === 'not-allowed' ? 'Allow the microphone, or type instead.' : 'Try again, or type instead.', 'bad');
      rec.onend = () => { rec = null; mic.classList.remove('on'); };
      mic.classList.add('on'); rec.start();
    });
  }

  /* ---------- diagnosis ---------- */
  const PROMPT = what => `You are a careful, practical repair expert in India helping someone with no repair experience.
Look at the photo(s)${what ? ` and read their description: "${what.replace(/"/g, "'")}"` : ''}.
Write every text field in ${Q.langPrompt()}, except "search_term" which must be English.
Return JSON only, with exactly this shape:
{
 "is_repairable_thing": boolean,
 "item": string,                  // what the object is
 "problem": string,               // the most likely problem, one sentence
 "confidence": number,            // 0 to 1
 "other_causes": [{"cause": string, "how_to_check": string}],   // max 3
 "danger_now": string|null,       // only for real immediate danger (gas smell, burning smell, sparks, exposed live wire, water near electricity): what to do right now
 "safety": {"level": "diy_safe"|"diy_careful"|"call_pro", "why": string, "first_steps": [string]},
 "tools": [string],
 "parts": [{"name": string, "cost_min": number, "cost_max": number}],   // typical Indian prices in rupees
 "steps": [string],               // clear repair steps in order, max 8. Empty if call_pro.
 "time_minutes": number|null,
 "difficulty": "easy"|"medium"|"hard",
 "pro_cost_min": number|null, "pro_cost_max": number|null,        // typical charge in rupees for a professional visit and repair in an Indian town
 "trade": "plumber"|"electrician"|"appliance_repair"|"mobile_repair"|"computer_repair"|"bike_mechanic"|"car_mechanic"|"bicycle_repair"|"carpenter"|"tailor"|"cobbler"|"hardware_shop",
 "search_term": string,           // what to search on Google Maps, e.g. "ceiling fan repair"
 "if_not_fixed": string           // what to do if the steps do not work
}
Safety rules: anything with mains electricity inside walls or the distribution board, gas cylinders or pipes, LPG regulators, vehicle brakes, airbags, lifts, roofs or heights above a stool, and swollen or leaking batteries is "call_pro". Always say to switch off power or water first when relevant. Never suggest bypassing safety parts. If the photo is unclear, say what photo would help in "problem" and set confidence low.`;

  const S = Q.S;
  const SCHEMA = S.obj({
    is_repairable_thing: S.bool(), item: S.str(), problem: S.str(), confidence: S.num('0 to 1'),
    other_causes: S.list(S.obj({ cause: S.str(), how_to_check: S.str() })),
    danger_now: S.maybe(S.str('Only for real immediate danger')),
    safety: S.obj({ level: S.oneOf(['diy_safe', 'diy_careful', 'call_pro']), why: S.str(), first_steps: S.list(S.str()) }),
    tools: S.list(S.str()),
    parts: S.list(S.obj({ name: S.str(), cost_min: S.num(), cost_max: S.num() })),
    steps: S.list(S.str()),
    time_minutes: S.maybe(S.num()), difficulty: S.oneOf(['easy', 'medium', 'hard']),
    pro_cost_min: S.maybe(S.num()), pro_cost_max: S.maybe(S.num()),
    trade: S.oneOf(Object.keys(TRADES)),
    search_term: S.str('English search for Google Maps'), if_not_fixed: S.str()
  });
  let diag = null;
  $('fix-btn').addEventListener('click', async e => {
    if (!shots.items.length) return;
    const btn = e.currentTarget;
    Q.busy(btn, true, 'Looking closely…');
    $('result').innerHTML = '<div class="skeleton" style="height:28px;width:50%"></div><div class="skeleton" style="height:90px;margin-top:14px"></div><div class="skeleton" style="height:220px;margin-top:14px"></div>';
    try {
      const r = await Q.gemini({ json: true, schema: SCHEMA, temperature: 0.2, parts: [...shots.parts(), { text: PROMPT($('what').value.trim()) }] });
      diag = r.json;
      render(diag);
      flow(2);
      if (TRADES[diag.trade]) $('trade').value = diag.trade;
      updateGmaps();
      if (Q.place() && map) findShops();
    } catch (err) { Q.fail(err, $('result')); }
    finally { Q.busy(btn, false); }
  });

  function render(d) {
    const list = a => Array.isArray(a) ? a.filter(Boolean) : [];
    if (!d.is_repairable_thing) {
      $('result').innerHTML = Q.notice('warn', `<b>Could not find a broken object in the photo.</b> ${Q.esc(d.problem || 'Take a closer photo of the broken part.')}`);
      return;
    }
    const s = d.safety || {}, lvl = { diy_safe: ['ok', 'Safe to try yourself'], diy_careful: ['warn', 'Try with care'], call_pro: ['bad', 'Call a professional'] }[s.level] || ['warn', 'Try with care'];
    const parts = list(d.parts), costMin = parts.reduce((a, p) => a + (+p.cost_min || 0), 0), costMax = parts.reduce((a, p) => a + (+p.cost_max || 0), 0);
    const range = (a, b) => a || b ? (a === b || !b ? Q.inr(a || b) : `${Q.inr(a)} to ${Q.inr(b)}`) : 'Not needed';
    const conf = Math.round(Math.max(0, Math.min(1, +d.confidence || 0)) * 100);
    const trade = TRADES[d.trade];
    $('result').innerHTML = `
      ${d.danger_now ? `<div class="danger" role="alert"><b>Do this now</b>${Q.esc(d.danger_now)}</div>` : ''}
      <div class="diag"><span class="item">${Q.esc(d.item)}</span><h2>${Q.esc(d.problem)}</h2>
        <div class="conf"><span>How sure</span><div class="meter" role="img" aria-label="${conf}% sure"><i style="width:${conf}%"></i></div><span>${conf}%</span></div></div>
      <div class="safety ${Q.esc(s.level || 'diy_careful')}"><span class="status ${lvl[0]}">${lvl[1]}</span>
        ${s.why ? `<p>${Q.esc(s.why)}</p>` : ''}
        ${list(s.first_steps).length ? `<ul>${list(s.first_steps).map(x => `<li>${Q.esc(x)}</li>`).join('')}</ul>` : ''}</div>
      <div class="facts">
        <div><span>Parts</span><b>${range(costMin, costMax)}</b></div>
        <div><span>Professional</span><b>${range(+d.pro_cost_min || 0, +d.pro_cost_max || 0)}</b></div>
        <div><span>Time${d.difficulty ? ', ' + Q.esc({ easy: 'easy', medium: 'medium', hard: 'hard' }[d.difficulty] || d.difficulty) : ''}</span><b>${d.time_minutes ? (d.time_minutes >= 90 ? (d.time_minutes / 60).toFixed(1) + ' hours' : Math.round(d.time_minutes) + ' min') : '?'}</b></div>
      </div>
      ${list(d.steps).length && s.level !== 'call_pro' ? `<div class="block"><h3>How to fix it</h3><ol class="steps-list">${list(d.steps).map(x => `<li>${Q.esc(x)}</li>`).join('')}</ol></div>` : ''}
      ${list(d.tools).length || parts.length ? `<div class="block"><h3>What you need</h3><div class="need">${list(d.tools).map(t => `<span>${Q.esc(t)}</span>`).join('')}${parts.map(p => `<span>${Q.esc(p.name)} (${range(+p.cost_min || 0, +p.cost_max || 0)})</span>`).join('')}</div></div>` : ''}
      ${list(d.other_causes).length ? `<div class="block"><h3>If that is not it</h3><ul class="list causes">${list(d.other_causes).map(c => `<li><b>${Q.esc(c.cause)}</b><span>${Q.esc(c.how_to_check)}</span></li>`).join('')}</ul></div>` : ''}
      ${d.if_not_fixed ? `<div class="block"><h3>Still not working?</h3><p>${Q.esc(d.if_not_fixed)}</p></div>` : ''}
      <div class="row block"><a class="btn btn-app" href="#nearby" id="go-near">Find a ${Q.esc(trade ? trade.label.toLowerCase() : 'repair shop')} nearby</a></div>
      <p class="ai-note" style="margin-top:14px">AI estimate from your photo. Costs are typical Indian prices and vary by town. When in doubt, switch off and call a professional.</p>`;
    if (innerWidth < 900) $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- nearby help ---------- */
  let map = null, layer = null, shopsFound = [];
  const picker = new Q.PlacePicker($('place'), { label: 'Searching near', onPlace: () => { updateGmaps(); findShops(); } });
  $('trade').addEventListener('change', () => { updateGmaps(); if (Q.place()) findShops(); });
  $('radius').addEventListener('change', () => { if (Q.place()) findShops(); });
  $('find-btn').addEventListener('click', () => Q.place() ? findShops() : Q.toast('Choose a location first', 'Press "Use my location" or type your town.'));

  function updateGmaps() {
    const p = Q.place(), t = TRADES[$('trade').value];
    const what = (diag?.trade === $('trade').value && diag.search_term) ? diag.search_term : t.search;
    const where = !p ? '' : p.gps ? ` near ${p.lat},${p.lon}` : ` near ${p.name}`;
    $('gmaps').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(what + where)}`;
  }
  updateGmaps();

  function ensureMap() {
    if (map) return true;
    if (!window.L) { Q.toast('Map could not load', 'Check your internet connection. Google Maps search still works.', 'bad'); return false; }
    $('map').innerHTML = '';
    map = L.map('map', { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    layer = L.layerGroup().addTo(map);
    return true;
  }
  const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon); const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

  async function overpass(query) {
    const hosts = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
    let last;
    for (const h of hosts) {
      try {
        const res = await fetch(h, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(query) });
        if (res.ok) return await res.json();
        last = new Q.QError('Map search busy', 'The free shop search is busy. Try again in a minute, or use Search on Google Maps.');
      } catch (e) { last = new Q.QError('Map search unavailable', 'Check your internet connection, or use Search on Google Maps.'); }
    }
    throw last;
  }

  let seq = 0;
  async function findShops() {
    const p = Q.place(); if (!p) return;
    if (!ensureMap()) return;
    const me = ++seq, t = TRADES[$('trade').value], radius = +$('radius').value;
    $('shops').innerHTML = '<li class="skeleton" style="height:58px"></li><li class="skeleton" style="height:58px"></li>';
    map.setView([p.lat, p.lon], radius > 5000 ? 12 : radius > 2000 ? 13 : 14);
    layer.clearLayers();
    L.circleMarker([p.lat, p.lon], { radius: 8, color: '#fff', weight: 3, fillColor: '#1d2129', fillOpacity: 1 }).addTo(layer).bindPopup(p.gps ? 'You are here' : Q.esc(p.name));
    const q = `[out:json][timeout:25];(${t.tags.map(tag => { const [k, v] = tag.split('='); return `nwr["${k}"="${v}"](around:${radius},${p.lat},${p.lon});`; }).join('')});out center 80;`;
    try {
      const data = await overpass(q);
      if (me !== seq) return;
      const seen = new Set();
      shopsFound = (data.elements || []).map(el => {
        const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon, tg = el.tags || {};
        return { id: el.type + el.id, lat, lon, name: tg.name || tg['name:en'] || null, kind: tg.craft || tg.shop || '', phone: tg.phone || tg['contact:phone'] || null,
          addr: [tg['addr:housenumber'], tg['addr:street'], tg['addr:city']].filter(Boolean).join(', '), hours: tg.opening_hours || null, d: km(p, { lat, lon }) };
      }).filter(s => s.lat != null && !seen.has(s.id) && seen.add(s.id)).sort((a, b) => (!!b.name - !!a.name) || a.d - b.d).slice(0, 30).sort((a, b) => a.d - b.d);
      renderShops(p, t);
    } catch (err) {
      if (me !== seq) return;
      $('shops').innerHTML = `<li>${Q.notice('warn', `<b>${Q.esc(err.title)}.</b> ${Q.esc(err.message)}`)}</li>`;
    }
  }
  const markers = {};
  function renderShops(p, t) {
    Object.keys(markers).forEach(k => delete markers[k]);
    const kindWord = k => k.replace(/_/g, ' ');
    shopsFound.forEach(s => {
      markers[s.id] = L.circleMarker([s.lat, s.lon], { radius: 7, color: '#fff', weight: 2, fillColor: '#127a82', fillOpacity: 1 })
        .addTo(layer).bindPopup(`<b>${Q.esc(s.name || 'Unnamed ' + kindWord(s.kind))}</b><br>${s.d.toFixed(1)} km away`);
    });
    if (shopsFound.length) map.fitBounds(L.latLngBounds([[p.lat, p.lon], ...shopsFound.map(s => [s.lat, s.lon])]), { padding: [30, 30], maxZoom: 16 });
    $('near-hint').textContent = `${shopsFound.length} found within ${$('radius').value / 1000} km`;
    $('shops').innerHTML = shopsFound.length ? shopsFound.map(s => `<li data-id="${s.id}">
        <div class="top"><b>${Q.esc(s.name || 'Unnamed ' + kindWord(s.kind))}</b><small>${s.d < 1 ? Math.round(s.d * 1000) + ' m' : s.d.toFixed(1) + ' km'}</small></div>
        <small>${Q.esc(kindWord(s.kind))}${s.addr ? ', ' + Q.esc(s.addr) : ''}${s.hours ? '. Hours: ' + Q.esc(s.hours) : ''}</small>
        <div class="links"><a class="btn btn-sm btn-app" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}">Directions</a>${s.phone ? `<a class="btn btn-sm" href="tel:${Q.esc(s.phone.split(';')[0].replace(/\s/g, ''))}">Call</a>` : ''}</div></li>`).join('')
      : `<li>${Q.notice('warn', `<b>No ${Q.esc(t.label.toLowerCase())} listed on OpenStreetMap within ${$('radius').value / 1000} km.</b> Many local shops are not mapped yet. Try a bigger distance, or use <b>Search on Google Maps</b>.`)}</li>`;
  }
  $('shops').addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const li = e.target.closest('li[data-id]'); if (!li) return;
    const m = markers[li.dataset.id]; if (m) { map.setView(m.getLatLng(), 16); m.openPopup(); }
    $('shops').querySelectorAll('li').forEach(x => x.classList.toggle('active', x === li));
  });
  // a location saved in another app is reused here
  addEventListener('load', () => { if (Q.place() && window.L) findShops(); });
  window.FixIt = { picker };
})();

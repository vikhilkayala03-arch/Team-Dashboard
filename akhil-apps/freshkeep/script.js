/* =========================================================
   FreshKeep
   Photo of food -> Gemini lists each item, how fresh it looks and
   its days left at 25°C (outside) and in a fridge.
   The app adjusts outside days for YOUR weather (Open-Meteo, no key)
   with the Q10 rule: every 10°C warmer, food spoils about twice as fast.
   Then: cook-first order, a meal plan that uses everything in time,
   and a kitchen tracker that counts down on this device.
   ========================================================= */
(function () {
  'use strict';
  Q.shell('freshkeep');
  const $ = Q.$;
  Q.fileNotice($('file-note'), 'camera or location');

  const flowSteps = [...document.querySelectorAll('#flow li')];
  const flow = n => flowSteps.forEach((li, i) => { li.className = i < n ? 'done' : i === n ? 'now' : ''; });

  const shots = new Q.Shots($('shots'), {
    max: 3, title: 'Photo of your food',
    hint: 'Spread the items out on a table, or open the fridge. Good light helps.',
    onChange: items => { $('check-btn').disabled = !items.length; flow(items.length ? 1 : 0); }
  });

  /* ---------- weather ---------- */
  let wx = null, lastItems = null;
  const factor = () => Math.pow(2, ((wx ? wx.avg : 25) - 25) / 10);
  new Q.PlacePicker($('place'), { label: 'Weather for', onPlace: loadWeather });
  if (Q.place()) loadWeather(Q.place());
  else $('weather').innerHTML = '<p class="small muted">Without a location the app assumes 25°C.</p>';

  async function loadWeather(p) {
    $('weather').innerHTML = '<div class="skeleton" style="height:76px"></div>';
    try { wx = await Q.weather(p); renderWeather(); if (lastItems) renderItems(lastItems); }
    catch (err) { wx = null; Q.fail(err, $('weather')); }
  }
  function renderWeather() {
    const f = factor();
    $('weather').innerHTML = `<div class="wx"><span class="temp">${Math.round(wx.avg)}°C</span>
      <p>Average for the next 3 days${wx.rh != null ? `, humidity now ${Math.round(wx.rh)}%` : ''}. Food kept outside the fridge ${f >= 1.05 ? `spoils about <b>${f.toFixed(1)} times</b> as fast as at 25°C` : f <= 0.95 ? `lasts about <b>${(1 / f).toFixed(1)} times</b> as long as at 25°C` : 'lasts about as long as at 25°C'}.</p></div>
      <details class="method"><summary>How this is worked out</summary><p>The AI estimates how many days each item has left at 25°C. FreshKeep then adjusts for your temperature with a common food-science rule: every 10°C warmer, food spoils about twice as fast (the Q10 rule). Days here = days at 25°C ÷ 2<sup>(T − 25) ÷ 10</sup>, with T = ${wx.avg}°C. It uses the outdoor forecast; a cooler room keeps food longer.</p></details>`;
  }

  /* ---------- check the food ---------- */
  const PROMPT = () => `You are a food storage expert for Indian homes. Identify each separate food item in the photo(s) and judge how fresh it looks.
Write "local_name", "signs" and "store_tip" in ${Q.langPrompt()}. Write "name" in English.
Return JSON only, with exactly this shape:
{"not_food": boolean,
 "items": [{"name": string, "local_name": string, "amount": string|null,
   "category": "vegetable"|"leafy"|"fruit"|"dairy"|"cooked"|"bread_grain"|"other",
   "freshness": "fresh"|"use_soon"|"use_today"|"spoiled",
   "signs": string,
   "best_place": "room"|"fridge",
   "room_days_25c": number,
   "fridge_days": number,
   "store_tip": string}]}
room_days_25c: days it has LEFT from now (given how it looks) if kept outside the fridge at 25°C. fridge_days: days left in a fridge at about 4°C. Use decimals for less than a day (cooked food left out is about 0.3). Be realistic for Indian homes. Maximum 15 items. Mould, slime, a bad smell sign or a swollen pack means "spoiled".`;

  const S = Q.S;
  const ITEMS_SCHEMA = S.obj({
    not_food: S.bool(),
    items: S.list(S.obj({
      name: S.str('English name'), local_name: S.str(), amount: S.maybe(S.str()),
      category: S.oneOf(['vegetable', 'leafy', 'fruit', 'dairy', 'cooked', 'bread_grain', 'other']),
      freshness: S.oneOf(['fresh', 'use_soon', 'use_today', 'spoiled']), signs: S.str(),
      best_place: S.oneOf(['room', 'fridge']), room_days_25c: S.num(), fridge_days: S.num(), store_tip: S.str()
    }))
  });
  const PLAN_SCHEMA = S.obj({
    days: S.list(S.obj({ day: S.num(), meals: S.list(S.obj({ meal: S.oneOf(['Breakfast', 'Lunch', 'Dinner']), dish: S.str(), uses: S.list(S.str()), time_min: S.num(), steps: S.list(S.str()) })) })),
    leftover_tip: S.str(), unused: S.list(S.str())
  });

  $('check-btn').addEventListener('click', async e => {
    if (!shots.items.length) return;
    const btn = e.currentTarget;
    Q.busy(btn, true, 'Checking each item…');
    $('result').innerHTML = '<div class="skeleton" style="height:26px;width:45%"></div>' + '<div class="skeleton" style="height:70px;margin-top:10px"></div>'.repeat(4);
    try {
      const r = await Q.gemini({ json: true, schema: ITEMS_SCHEMA, temperature: 0.2, parts: [...shots.parts(), { text: PROMPT() }] });
      const items = (r.json.items || []).filter(i => i && i.name).map(i => ({ ...i, room_days_25c: Math.max(0, +i.room_days_25c || 0), fridge_days: Math.max(0, +i.fridge_days || 0) }));
      if (r.json.not_food || !items.length) { $('result').innerHTML = Q.notice('warn', '<b>No food found in the photo.</b> Put the items together in good light and try again.'); return; }
      lastItems = items;
      renderItems(items);
      flow(2);
    } catch (err) { Q.fail(err, $('result')); }
    finally { Q.busy(btn, false); }
  });

  const daysLeft = i => (i.best_place === 'fridge' ? i.fridge_days : i.room_days_25c / factor());
  const daysWord = d => d < 1 ? 'less than a day' : `${Math.round(d)} day${Math.round(d) === 1 ? '' : 's'}`;
  function statusOf(i, d) {
    const rank = { fresh: 0, use_soon: 1, use_today: 2 }[i.freshness] ?? 0;
    const byDays = d < 1 ? 2 : d < 3 ? 1 : 0;
    return [['ok', 'Fresh'], ['warn', 'Use soon'], ['bad', 'Use today']][Math.max(rank, byDays)];
  }

  function renderItems(items) {
    const spoiled = items.filter(i => i.freshness === 'spoiled');
    const good = items.filter(i => i.freshness !== 'spoiled').map(i => ({ ...i, left: daysLeft(i) })).sort((a, b) => a.left - b.left);
    const firstNames = good.slice(0, 2).map(i => i.name.toLowerCase());
    $('result').innerHTML = `
      <div class="panel-head"><h2>${good.length ? `Cook first: ${Q.esc(firstNames.join(' and '))}` : 'Nothing usable found'}</h2><span class="hint">${wx ? `At ${Math.round(wx.avg)}°C` : 'Assuming 25°C'}</span></div>
      ${good.length ? `<ul class="items">${good.map((i, n) => {
        const st = statusOf(i, i.left), out = i.room_days_25c / factor();
        return `<li class="${n < 2 ? 'first' : ''}">
          <div class="days"><b>${i.left < 1 ? '&lt;1' : Math.round(i.left)}</b><span>${Math.round(i.left) === 1 && i.left >= 1 ? 'day' : 'days'} left</span></div>
          <div><div class="nm">${Q.esc(i.name)}${i.local_name && i.local_name.toLowerCase() !== i.name.toLowerCase() ? `<small>${Q.esc(i.local_name)}</small>` : ''}${i.amount ? `<small>${Q.esc(i.amount)}</small>` : ''}</div>
            <div class="tip">${Q.esc(i.store_tip || i.signs || '')}</div>
            <div class="where">${i.best_place === 'fridge' ? `Best in the fridge: ${daysWord(i.fridge_days)}. Outside here: ${daysWord(out)}.` : `Best outside the fridge: ${daysWord(out)} here. In the fridge: ${daysWord(i.fridge_days)}.`}</div></div>
          <span class="status ${st[0]}">${st[1]}</span></li>`;
      }).join('')}</ul>` : ''}
      ${spoiled.length ? `<div class="discard">${Q.notice('bad', `<b>Throw away: ${spoiled.map(i => Q.esc(i.name)).join(', ')}.</b> ${spoiled.map(i => Q.esc(i.signs || '')).filter(Boolean).join(' ')} Eating spoiled food can make you sick; cooking does not make it safe.`)}</div>` : ''}
      ${good.length ? `<div class="row" style="margin-top:16px"><button class="btn btn-app" type="button" id="plan-btn">Make a meal plan</button><button class="btn" type="button" id="track-btn">Track in my kitchen</button></div>` : ''}
      <p class="ai-note" style="margin-top:12px">AI estimate from the photo. Smell and look before you cook; when in doubt, throw it out.</p>`;
    $('plan-btn')?.addEventListener('click', ev => makePlan(good, ev.currentTarget));
    $('track-btn')?.addEventListener('click', () => track(good));
  }

  /* ---------- meal plan ---------- */
  async function makePlan(items, btn) {
    const list = items.slice().sort((a, b) => a.left - b.left).map(i => `${i.name}${i.amount ? ` (${i.amount})` : ''}: ${daysWord(i.left)} left`).join('; ');
    const panel = $('plan-panel');
    Q.busy(btn, true, 'Planning meals…');
    panel.hidden = false;
    panel.innerHTML = '<div class="skeleton" style="height:26px;width:50%"></div><div class="skeleton" style="height:180px;margin-top:12px"></div>';
    try {
      const r = await Q.gemini({ json: true, schema: PLAN_SCHEMA, temperature: 0.6, prompt: `Plan home meals for ${Math.max(1, +$('people').value || 4)} people for the next 3 days: lunch and dinner, plus breakfast only when it uses something urgent.
Food: ${$('diet').value}. Cooking style: ${$('style').value}.
Food at home, most urgent first: ${list}.
Use every item before it runs out; anything with 1 day or less must be used on day 1. Prefer simple everyday dishes. Basic pantry items (rice, atta, dal, oil, salt, spices, onion, ginger, garlic) may be used.
Write "dish", "steps" and "leftover_tip" in ${Q.langPrompt()}. Keep the item names in "uses" and "unused" exactly as written above, in English.
Return JSON only: {"days":[{"day":1,"meals":[{"meal":"Breakfast"|"Lunch"|"Dinner","dish":string,"uses":[string],"time_min":number,"steps":[string]}]}],"leftover_tip":string,"unused":[string]}
Maximum 6 short steps per dish.` });
      const p = r.json, days = Array.isArray(p.days) ? p.days : [];
      const dayName = n => n === 1 ? 'Today' : n === 2 ? 'Tomorrow' : new Date(Date.now() + (n - 1) * 864e5).toLocaleDateString('en-IN', { weekday: 'long' });
      panel.innerHTML = `<div class="panel-head"><h2>Cook-first meal plan</h2><span class="hint">${Math.max(1, +$('people').value || 4)} people, ${Q.esc($('diet').selectedOptions[0].text.toLowerCase())}</span></div>
        ${days.map(d => `<div class="plan-day"><h3>${dayName(+d.day || 1)}</h3>${(d.meals || []).map(m => `<div class="meal">
          <div class="top"><span class="when">${Q.esc(m.meal)}${m.time_min ? `, about ${Math.round(m.time_min)} min` : ''}</span></div>
          <h4>${Q.esc(m.dish)}</h4>
          <div class="uses">${(m.uses || []).map(u => `<span>${Q.esc(u)}</span>`).join('')}</div>
          ${(m.steps || []).length ? `<details><summary>How to make it</summary><ol>${m.steps.map(s => `<li>${Q.esc(s)}</li>`).join('')}</ol></details>` : ''}</div>`).join('')}</div>`).join('')}
        ${p.leftover_tip ? `<div class="notice ok" style="margin-top:12px"><span class="ic">✓</span><div>${Q.esc(p.leftover_tip)}</div></div>` : ''}
        ${(p.unused || []).length ? `<p class="small muted" style="margin-top:10px">Not used in the plan: ${p.unused.map(Q.esc).join(', ')}. Store these well or use them in snacks.</p>` : ''}`;
      if (innerWidth < 900) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) { Q.fail(err, panel); }
    finally { Q.busy(btn, false); }
  }

  /* ---------- kitchen tracker (this device) ---------- */
  const TK = 'freshkeep.kitchen';
  function track(items) {
    const now = Date.now(), list = Q.load(TK, []);
    items.forEach(i => {
      const k = i.name.toLowerCase(), entry = { id: Q.uid(), name: i.name, local: i.local_name || '', place: i.best_place, saved: now, expires: now + i.left * 864e5 };
      const at = list.findIndex(x => x.name.toLowerCase() === k);
      if (at >= 0) list[at] = entry; else list.push(entry);
    });
    Q.save(TK, list);
    renderTrack();
    Q.toast('Saved to your kitchen', `${items.length} item${items.length === 1 ? '' : 's'} will count down on this device.`);
  }
  function renderTrack() {
    const list = Q.load(TK, []).sort((a, b) => a.expires - b.expires), now = Date.now();
    $('track-actions').hidden = !list.length;
    $('track').innerHTML = list.length ? list.map(x => {
      const d = (x.expires - now) / 864e5;
      const n = Math.floor(d);
      const st = d < 0 ? ['bad', 'Check before use'] : d < 1 ? ['bad', 'Use today'] : d < 3 ? ['warn', `${n} day${n === 1 ? '' : 's'} left`] : ['ok', `${n} days left`];
      return `<li><div><b>${Q.esc(x.name)}</b><span class="status ${st[0]}">${st[1]}</span></div><button type="button" data-del="${x.id}" aria-label="Remove ${Q.esc(x.name)}">×</button></li>`;
    }).join('') : '<li class="muted small" style="border:0;padding:4px 0">Nothing tracked yet. After checking your food, press Track in my kitchen.</li>';
  }
  $('track').addEventListener('click', e => {
    const b = e.target.closest('[data-del]'); if (!b) return;
    Q.save(TK, Q.load(TK, []).filter(x => x.id !== b.dataset.del)); renderTrack();
  });
  $('clear-track').addEventListener('click', () => { Q.save(TK, []); renderTrack(); });
  $('plan-tracked').addEventListener('click', e => {
    const now = Date.now();
    const items = Q.load(TK, []).filter(x => x.expires > now - 864e5).map(x => ({ name: x.name, left: Math.max(0, (x.expires - now) / 864e5) }));
    if (!items.length) return Q.toast('Nothing usable left', 'Check your food again to add fresh items.');
    makePlan(items, e.currentTarget);
  });
  renderTrack();
})();

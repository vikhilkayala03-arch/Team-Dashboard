/* =========================================================
   Paper Helper
   Photo(s) or PDF of a paper -> Gemini reads it -> plain-language
   summary, key details, steps, deadline (+ reminder), scam check,
   hard words, read aloud, and follow-up questions about the paper.
   ========================================================= */
(function () {
  'use strict';
  Q.shell('paperhelper');
  const $ = Q.$;
  Q.fileNotice($('file-note'), 'camera');

  const flowSteps = [...document.querySelectorAll('#flow li')];
  const flow = n => flowSteps.forEach((li, i) => { li.className = i < n ? 'done' : i === n ? 'now' : ''; });

  const shots = new Q.Shots($('shots'), {
    max: 5, pdf: true, title: 'Photo of the paper',
    hint: 'Flat on a table, in good light, all four corners showing. Add one photo per page.',
    onChange: items => { $('read-btn').disabled = !items.length; flow(items.length ? 1 : 0); }
  });
  const langNote = () => { $('lang-note').textContent = `Answer in ${Q.LANGS[Q.lang()].label}. Change it at the top.`; };
  langNote(); document.addEventListener('quadrant:lang', langNote);

  let current = null;   // { result, parts, chat: [] }

  /* The exact answer layout Gemini must follow */
  const S = Q.S;
  const SCHEMA = S.obj({
    is_document: S.bool(),
    doc_type: S.str('What kind of paper, e.g. Electricity bill'),
    from: S.maybe(S.str('Who sent or issued it')),
    title: S.str('Short title for this paper'),
    summary: S.str('2 to 4 short sentences: what it is and what it means for the reader'),
    key_details: S.list(S.obj({ label: S.str(), value: S.str() })),
    deadline: S.maybe(S.obj({ date: S.str('YYYY-MM-DD'), what: S.str() })),
    actions: S.list(S.str()),
    urgency: S.oneOf(['today', 'this_week', 'this_month', 'no_rush']),
    scam: S.obj({ level: S.oneOf(['safe', 'careful', 'likely_scam']), reasons: S.list(S.str()), advice: S.str() }),
    hard_words: S.list(S.obj({ word: S.str(), meaning: S.str() })),
    contacts: S.list(S.obj({ label: S.str(), value: S.str() })),
    read_aloud: S.str('Short spoken version, under 80 words')
  });

  const PROMPT = (note) => `You help ordinary people in India understand papers they receive: bills, bank letters, government notices, school circulars, legal or police notices, land records, insurance and hospital papers, forms.
Read the attached page(s). Write every explanation in ${Q.langPrompt()}. Keep names, numbers, amounts, dates and reference numbers exactly as printed.
${note ? `The user adds: "${note.replace(/"/g, "'")}".` : ''}
Return JSON only, with exactly this shape:
{
 "is_document": boolean,
 "doc_type": string,            // e.g. "Electricity bill", in the answer language
 "from": string|null,           // who sent or issued it
 "title": string,               // a short title for this paper
 "summary": string,             // 2 to 4 short sentences: what this paper is and what it means for the reader
 "key_details": [{"label": string, "value": string}],  // amounts, due dates, account/consumer/reference numbers, names, places. Max 8.
 "deadline": {"date": "YYYY-MM-DD", "what": string}|null,  // the most important date by which the reader must act
 "actions": [string],           // what the reader should do, in order, each one short. Empty if nothing to do.
 "urgency": "today"|"this_week"|"this_month"|"no_rush",
 "scam": {"level": "safe"|"careful"|"likely_scam", "reasons": [string], "advice": string},
 "hard_words": [{"word": string, "meaning": string}],  // legal, banking or official words on the paper, explained simply. Max 6.
 "contacts": [{"label": string, "value": string}],     // official phone numbers, offices or websites printed on the paper
 "read_aloud": string           // a short spoken version (under 80 words) in the answer language
}
Rules:
- Never invent amounts, dates or numbers. If something is unclear, say so in the summary.
- Scam signs: asks for OTP, PIN, password or card details; payment to a personal UPI ID or personal bank account; prize or lottery you did not enter; threat of immediate disconnection or arrest with a personal mobile number; links not on official websites; spelling mistakes in official names. Real government and bank papers ask you to pay through official websites, apps or offices.
- If it is not a document, set is_document false and explain in the summary.`;

  $('read-btn').addEventListener('click', async e => {
    if (!shots.items.length) return;
    const btn = e.currentTarget, parts = shots.parts();
    Q.busy(btn, true, 'Reading the paper…');
    $('result').innerHTML = '<div class="skeleton" style="height:28px;width:40%"></div><div class="skeleton" style="height:120px;margin-top:14px"></div><div class="skeleton" style="height:200px;margin-top:14px"></div>';
    try {
      const r = await Q.gemini({ json: true, schema: SCHEMA, temperature: 0.2, parts: [...parts, { text: PROMPT($('note').value.trim()) }] });
      current = { result: r.json, parts, chat: [], lang: Q.lang() };
      render(r.json);
      flow(2);
      saveHistory(r.json, shots.items.find(i => i.thumb)?.thumb || null);
    } catch (err) {
      Q.fail(err, $('result'));
    } finally { Q.busy(btn, false); }
  });

  function render(d) {
    const urgency = { today: ['bad', 'Act today'], this_week: ['warn', 'Act this week'], this_month: ['info', 'Act this month'], no_rush: ['ok', 'No rush'] }[d.urgency] || null;
    const scam = d.scam || { level: 'careful', reasons: [], advice: '' };
    const scamHead = { safe: ['ok', 'Looks genuine'], careful: ['warn', 'Check before you act'], likely_scam: ['bad', 'Looks like a scam'] }[scam.level] || ['warn', 'Check before you act'];
    const list = a => Array.isArray(a) ? a.filter(Boolean) : [];
    if (!d.is_document) {
      $('result').innerHTML = Q.notice('warn', `<b>This does not look like a paper or document.</b> ${Q.esc(d.summary || '')}`);
      return;
    }
    let deadlineHtml = '';
    if (d.deadline && /^\d{4}-\d{2}-\d{2}$/.test(d.deadline.date || '')) {
      const days = Q.daysUntil(d.deadline.date);
      deadlineHtml = `<div class="section"><div class="deadline">
        <div><span class="small muted">${days < 0 ? 'This date has passed' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`}</span><div class="when">${Q.date(d.deadline.date)}</div><span>${Q.esc(d.deadline.what || '')}</span></div>
        ${days >= 0 ? `<div class="row"><a class="btn btn-app btn-sm" target="_blank" rel="noopener" href="${Q.gcalUrl(d.title + ': ' + (d.deadline.what || ''), d.deadline.date, d.summary)}">Add to Google Calendar</a><button class="btn btn-sm" type="button" id="ics">Download reminder</button></div>` : ''}
      </div></div>`;
    }
    $('result').innerHTML = `
      <div class="result-title"><span class="doc-type">${Q.esc(d.doc_type || '')}${d.from ? ', from ' + Q.esc(d.from) : ''}</span>${urgency ? `<span class="status ${urgency[0]}">${urgency[1]}</span>` : ''}</div>
      <h2 class="doc-title">${Q.esc(d.title || d.doc_type || 'Your paper')}</h2>
      <p class="summary">${Q.esc(d.summary)}</p>
      <div class="row" style="margin-top:10px"><button class="btn btn-sm" type="button" id="speak">Read aloud</button><button class="btn btn-sm btn-quiet" type="button" id="stop-speak">Stop</button></div>
      ${deadlineHtml}
      ${list(d.actions).length ? `<div class="section"><h3>What to do</h3><ol class="checklist">${list(d.actions).map(a => `<li><span>${Q.esc(a)}</span></li>`).join('')}</ol></div>` : ''}
      <div class="section"><h3>Scam check</h3><div class="scam ${Q.esc(scam.level)}"><span class="status ${scamHead[0]}">${scamHead[1]}</span>
        ${list(scam.reasons).length ? `<ul>${list(scam.reasons).map(x => `<li>${Q.esc(x)}</li>`).join('')}</ul>` : ''}
        ${scam.advice ? `<p>${Q.esc(scam.advice)}</p>` : ''}
        <p class="small">Never share an OTP, PIN or password. Pay only through official websites, apps or offices. Report fraud on 1930 or cybercrime.gov.in.</p></div></div>
      ${list(d.key_details).length ? `<div class="section"><h3>Important details</h3><dl class="kv">${list(d.key_details).map(k => `<dt>${Q.esc(k.label)}</dt><dd>${Q.esc(k.value)}</dd>`).join('')}</dl></div>` : ''}
      ${list(d.hard_words).length ? `<div class="section"><h3>Difficult words</h3><dl class="words-list">${list(d.hard_words).map(w => `<div><dt>${Q.esc(w.word)}</dt><dd>${Q.esc(w.meaning)}</dd></div>`).join('')}</dl></div>` : ''}
      ${list(d.contacts).length ? `<div class="section"><h3>Official contacts on the paper</h3><dl class="kv">${list(d.contacts).map(k => `<dt>${Q.esc(k.label)}</dt><dd>${Q.esc(k.value)}</dd>`).join('')}</dl></div>` : ''}
      <p class="ai-note" style="margin-top:16px">Read by AI from your photo. Check important numbers and dates against the paper itself.</p>
      <div class="ask">
        <h3>Ask about this paper</h3>
        <div class="chat"><div class="chat-log" id="ask-log"></div>
          <div class="quick" id="ask-quick"></div>
          <form class="chat-form" id="ask-form"><label class="sr-only" for="ask-q">Your question</label><input class="input" id="ask-q" placeholder="For example: what happens if I pay late?" autocomplete="off"><button class="btn btn-app" type="submit">Ask</button></form></div>
      </div>`;
    $('speak').addEventListener('click', () => Q.speak(d.read_aloud || d.summary, current?.lang));
    $('stop-speak').addEventListener('click', () => 'speechSynthesis' in window && speechSynthesis.cancel());
    $('ics')?.addEventListener('click', () => Q.icsDownload(d.title + ': ' + (d.deadline.what || ''), d.deadline.date, d.summary));
    $('ask-quick').innerHTML = ['What happens if I ignore this?', 'Where do I pay or submit this?', 'Which documents will I need?'].map(q => `<button class="chip" type="button">${q}</button>`).join('');
    $('ask-quick').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) ask(b.textContent); });
    $('ask-form').addEventListener('submit', e => { e.preventDefault(); const q = $('ask-q').value.trim(); if (q) { $('ask-q').value = ''; ask(q); } });
    if (innerWidth < 900) $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function ask(q) {
    if (!current) return;
    const log = $('ask-log');
    const add = (cls, html) => { const el = document.createElement('div'); el.className = 'msg ' + cls; el.innerHTML = html; log.appendChild(el); log.scrollTop = log.scrollHeight; return el; };
    add('me', Q.esc(q));
    const wait = add('bot typing', 'Thinking…');
    if (!current.parts) { wait.remove(); add('bot', '<p>Questions work on papers explained in this visit. Explain the paper again to ask about it.</p>'); return; }
    const contents = [
      { role: 'user', parts: [...current.parts, { text: 'Here is my paper. Please read it.' }] },
      { role: 'model', parts: [{ text: JSON.stringify(current.result) }] },
      ...current.chat,
      { role: 'user', parts: [{ text: q }] }
    ];
    try {
      const r = await Q.gemini({ contents, temperature: 0.3, system: `You explain the user's paper to them. Answer in ${Q.langPrompt()}, in under 100 words, using only what the paper says plus general knowledge of Indian procedures. If unsure, say so and suggest the official contact on the paper. Never ask for OTPs, PINs or passwords.` });
      current.chat.push({ role: 'user', parts: [{ text: q }] }, { role: 'model', parts: [{ text: r.text }] });
      wait.remove(); add('bot', Q.md(r.text));
    } catch (err) { wait.remove(); add('bot', `<p><b>${Q.esc(err.title || 'Problem')}.</b> ${Q.esc(err.message)}</p>`); }
  }

  /* ---------- history on this device (small thumbnail + the explanation, no full photos) ---------- */
  const HK = 'paperhelper.history';
  function saveHistory(result, thumb) {
    const list = Q.load(HK, []);
    list.unshift({ id: Q.uid(), t: Date.now(), thumb, result });
    while (list.length > 12 || (!Q.save(HK, list) && list.length > 1)) list.pop();
    renderHistory();
  }
  function renderHistory() {
    const list = Q.load(HK, []);
    $('history').innerHTML = list.length ? list.map(h => `<li>${h.thumb ? `<img src="${h.thumb}" alt="">` : '<span class="ph">PDF</span>'}
      <div class="t"><b>${Q.esc(h.result.title || h.result.doc_type || 'Paper')}</b><span>${Q.date(h.t)}${h.result.deadline?.date ? ', due ' + Q.date(h.result.deadline.date) : ''}</span></div>
      <button class="btn btn-sm" type="button" data-open="${h.id}">Open</button><button class="btn btn-sm btn-quiet" type="button" data-del="${h.id}" aria-label="Delete">Delete</button></li>`).join('')
      : '<li class="muted small" style="border:0;padding:4px 0">Nothing yet. Papers you explain are listed here.</li>';
  }
  $('history').addEventListener('click', e => {
    const o = e.target.closest('[data-open]'), d = e.target.closest('[data-del]');
    const list = Q.load(HK, []);
    if (o) { const h = list.find(x => x.id === o.dataset.open); if (h) { current = { result: h.result, parts: null, chat: [], lang: Q.lang() }; render(h.result); flow(2); } }
    if (d) { Q.save(HK, list.filter(x => x.id !== d.dataset.del)); renderHistory(); }
  });
  renderHistory();
})();

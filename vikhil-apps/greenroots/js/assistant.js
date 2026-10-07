/* Voice-enabled assistant: Web Speech API for listening (mic) and speaking (read aloud). Answers come from the built-in data. */
const say=(t,w)=>{const d=document.createElement('div');d.className='m '+w;d.textContent=t;$('#msgs').appendChild(d);$('#msgs').scrollTop=1e9;return d};
function speak(t){if($('#speakOn').checked&&window.speechSynthesis){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-IN';speechSynthesis.speak(u)}}
function answer(q){const t=q.toLowerCase(),c=CROPS.find(c=>t.includes(c.name.toLowerCase().split(' ')[0]));
 if(c){const m=a=>a.map(x=>MONTHS[x-1]).join(', ');
  if(/profit|earn|cost|money/.test(t))return`${c.name}: about ${inr(profitPerAcre(c))} profit per acre (sample numbers). Cost ${inr(c.cost)}, yield ${c.yield} quintal at ${inr(c.price)}.`;
  return`${c.name}: sow in ${m(c.sow)}, harvest in ${m(c.harvest)}, about ${c.days} days. Best in ${c.soils.join('/')} soil. ${c.tip}`}
 if(/yellow|spot|pest|insect|disease|wilt|leaf|leaves/.test(t)){show('doctor');return'I opened the Plant Doctor. Tick the symptoms you can see.'}
 if(/weather|rain|forecast|spray/.test(t)){show('weather');return'Opening Field Weather. Use your location or pick a city.'}
 if(/calculator|profit|cost/.test(t)){show('calc');return'Opening the Profit Calculator.'}
 if(/sow now|this month|what to (grow|plant)/.test(t)){const s=CROPS.filter(c=>c.sow.includes(nowM)).map(c=>c.name);return s.length?'Good to sow this month: '+s.join(', ')+'.':'Not much sowing this month. Check the Sowing Calendar.'}
 if(/best crop|recommend|which crop/.test(t)){show('advisor');return'Opening the Crop Advisor. Choose soil, season and water.'}
 return'Try asking: "when to sow wheat", "profit from cotton", "what to sow now", or describe a plant problem.'}
async function ask(q){say(q,'me');const a=answer(q);say(a,'bot');speak(a)}
say('Hello! Ask me about a crop, or press 🎤 and speak.','bot');
const toggle=()=>$('#chat').classList.toggle('open');$('#chatBtn').onclick=toggle;$('#openChat').onclick=()=>{$('#chat').classList.add('open');$('#ci').focus()};
$('#cf').onsubmit=e=>{e.preventDefault();const q=$('#ci').value.trim();if(q){$('#ci').value='';ask(q)}};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
$('#mic').onclick=()=>{if(!SR){say('Voice input is not supported in this browser. Try Chrome.','bot');return}
 const r=new SR();r.lang='en-IN';r.onresult=e=>{$('#speakOn').checked=true;ask(e.results[0][0].transcript)};r.onerror=()=>say('I could not hear you. Please try again.','bot');r.start();$('#mic').textContent='🔴'; r.onend=()=>$('#mic').textContent='🎤'};

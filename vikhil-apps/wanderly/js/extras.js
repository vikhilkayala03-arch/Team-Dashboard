/* Packing list, phrasebook with speech synthesis, currency converter */
/* ---- Packing ---- */
function makePack(){const type=$('#kType').value,days=Math.max(1,+$('#kDays').value||1),ex=$$('#v-pack .chk input:checked').map(i=>i.value),n=Math.min(days,7);
 const cl=[`${n} × tops`,`${Math.min(n,5)} × bottoms`,`${n} × underwear & socks`,'Sleepwear'];
 const cats=[['Clothes',cl],...PACK.base,['Climate gear',PACK[type]],...ex.map(x=>[{hiking:'Hiking',swim:'Swimming',work:'Work'}[x],PACK[x]])];
 const chk=Store.get('pack',{});let tot=0,done=0;
 $('#packOut').hidden=false;$('#packOut').innerHTML='<h3>Packing progress</h3><div class="prog"><i id="pg"></i></div><p class="note" id="pgt"></p>'+cats.map(([c,items])=>`<div class="pk-cat"><h3>${c}</h3>${items.map(i=>{tot++;const ok=chk[i];if(ok)done++;return`<label class="pk ${ok?'done':''}"><input type="checkbox" data-i="${i}" ${ok?'checked':''}><span>${i}</span></label>`}).join('')}</div>`).join('');
 const upd=()=>{const t=$$('#packOut .pk input'),d=t.filter(i=>i.checked).length;$('#pg').style.width=(d/t.length*100)+'%';$('#pgt').textContent=d+' of '+t.length+' packed'};
 $('#packOut').onchange=e=>{const i=e.target.dataset.i;if(i==null)return;const c=Store.get('pack',{});c[i]=e.target.checked;Store.set('pack',c);e.target.parentNode.classList.toggle('done',e.target.checked);upd()};upd()}
$('#mkPack').onclick=makePack;
/* ---- Phrasebook: speechSynthesis reads the native script in the language's voice ---- */
$('#lang').innerHTML=Object.entries(PHRASES).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
function drawPhrases(){const L=PHRASES[$('#lang').value];
 $('#phrases').innerHTML=L.list.map((p,i)=>`<div class="phrase"><div><small>${p[0]}</small><b>${p[1]}</b><small>${p[2]}</small></div><button class="btn dark" data-say="${i}" aria-label="Hear ${p[0]}">🔊</button></div>`).join('');
 const has=window.speechSynthesis&&speechSynthesis.getVoices().some(v=>v.lang.toLowerCase().startsWith(L.lang.slice(0,2)));
 $('#voiceNote').textContent=window.speechSynthesis?(has?'':'Your device may not have a '+L.name+' voice installed, so the audio may sound off or be silent. The romanised text is always shown.'):'Speech is not supported in this browser.'}
$('#lang').onchange=drawPhrases;
$('#phrases').onclick=e=>{const b=e.target.closest('[data-say]');if(!b||!window.speechSynthesis)return;const L=PHRASES[$('#lang').value],u=new SpeechSynthesisUtterance(L.list[+b.dataset.say][1]);u.lang=L.lang;u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u)};
drawPhrases();if(window.speechSynthesis)speechSynthesis.onvoiceschanged=drawPhrases;
/* ---- Currency: live rates from open.er-api.com (free), falling back to stored approximations ---- */
let rates={...RATES},live=false;
$('#mCur').innerHTML=Object.keys(RATES).filter(c=>c!=='INR').map(c=>`<option>${c}</option>`).join('');
function conv(){const a=+$('#mAmt').value||0,c=$('#mCur').value,v=a*rates[c];$('#mOut').textContent=v.toLocaleString('en',{maximumFractionDigits:c==='JPY'||c==='IDR'?0:2})+' '+c;
 $('#mNote').textContent=live?'Live rate: 1 ₹ = '+rates[c].toFixed(4)+' '+c:'Approximate stored rate (could not reach live rates). Check your bank or card rate before paying.'}
$('#mAmt').oninput=$('#mCur').onchange=conv;conv();
fetch('https://open.er-api.com/v6/latest/INR').then(r=>r.json()).then(d=>{if(d&&d.rates){Object.keys(RATES).forEach(k=>{if(d.rates[k])rates[k]=d.rates[k]});live=true;conv()}}).catch(()=>{});

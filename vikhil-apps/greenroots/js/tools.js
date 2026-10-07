/* Crop Advisor, Plant Doctor, Profit Calculator, Sowing Calendar */
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const profitPerAcre=c=>c.yield*c.price-c.cost;
/* ---- Crop Advisor: score = season(3) + soil(2) + water(2, or 1 if one step away) ---- */
$('#advForm').onsubmit=e=>{e.preventDefault();
 const soil=$('#soil').value,season=$('#season').value,water=+$('#water').value;
 const ranked=CROPS.filter(c=>c.seasons.includes(season)).map(c=>{
  let s=3,why=['grows in '+season];
  if(c.soils.includes(soil)){s+=2;why.push('suits '+soil+' soil')}
  const d=Math.abs(c.water-water);if(d===0){s+=2;why.push('matches your water')}else if(d===1){s+=1;why.push('workable with your water')}
  return{c,s,why}}).sort((a,b)=>b.s-a.s||profitPerAcre(b.c)-profitPerAcre(a.c)).slice(0,5);
 $('#advOut').innerHTML=ranked.length?ranked.map(r=>{const c=r.c,p=profitPerAcre(c),pct=Math.round(r.s/7*100);
  return`<div class="card crop"><div class="e">${c.e}</div><div><h3>${c.name}</h3><p class="sub" style="margin-top:4px">${r.why.join(' · ')}. Sow in ${c.sow.map(m=>MONTHS[m-1]).join('–')}, ready in about ${c.days} days.</p>
  <p style="margin-top:6px"><b>Estimated profit:</b> <span class="${p>=0?'pos':'neg'}">${inr(p)}</span> per acre · <i>${c.tip}</i></p><div class="meter"><i style="width:${pct}%"></i></div></div><div class="pct">${pct}%</div></div>`}).join('')
  :'<div class="card">No crops found for this season.</div>'};
/* ---- Plant Doctor: ranks problems by how many of their symptoms you ticked ---- */
$('#symList').innerHTML=SYMPTOMS.map((s,i)=>`<label><input type="checkbox" value="${s}"><span>${s}</span></label>`).join('');
$('#clearSym').onclick=()=>{$$('#symList input').forEach(i=>i.checked=false);$('#docOut').innerHTML=''};
$('#diagnose').onclick=()=>{const sel=$$('#symList input:checked').map(i=>i.value);
 if(!sel.length){$('#docOut').innerHTML='<div class="card">Tick at least one symptom, then press Check symptoms.</div>';return}
 const r=PROBLEMS.map(p=>{const m=p.sym.filter(s=>sel.includes(s)).length;return{p,score:m?(m/p.sym.length)*.6+(m/sel.length)*.4:0}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
 $('#docOut').innerHTML=r.length?r.map((x,i)=>`<div class="card crop"><div class="e">${x.p.e}</div><div><h3>${i?'Also possible':'Most likely'}: ${x.p.n}</h3><ul style="margin:8px 0 0 18px">${x.p.fix.map(f=>`<li>${f}</li>`).join('')}</ul></div><div class="pct">${Math.round(x.score*100)}%</div></div>`).join('')
  :'<div class="card">No match found. Try ticking more symptoms or ask your KVK.</div>'};
/* ---- Profit Calculator ---- */
$('#cCrop').innerHTML=CROPS.map(c=>`<option value="${c.id}">${c.e} ${c.name}</option>`).join('');
function fillCalc(){const c=CROPS.find(x=>x.id===$('#cCrop').value);$('#cCost').value=c.cost;$('#cYield').value=c.yield;$('#cPrice').value=c.price;calc()}
function calc(){const a=+$('#cAcres').value||0,cost=(+$('#cCost').value||0)*a,y=(+$('#cYield').value||0)*a,price=+$('#cPrice').value||0;
 const rev=y*price,profit=rev-cost,roi=cost?profit/cost*100:0,be=y?cost/y:0,drop=y*price*.8-cost,mx=Math.max(rev,cost,1);
 $('#calcOut').innerHTML=`<p class="sub" style="margin:0">Estimated profit</p><div class="stat ${profit>=0?'pos':'neg'}">${inr(profit)}</div>
 <p>Return on cost: <b>${roi.toFixed(0)}%</b></p>
 <div class="bars"><div class="bar"><span>Cost</span><div><i style="width:${cost/mx*100}%;background:var(--clay)"></i></div><b>${inr(cost)}</b></div>
 <div class="bar"><span>Revenue</span><div><i style="width:${rev/mx*100}%;background:var(--leaf)"></i></div><b>${inr(rev)}</b></div></div>
 <p style="margin-top:16px"><b>Break-even price:</b> ${inr(be)} per quintal</p>
 <p><b>If the price falls 20%:</b> <span class="${drop>=0?'pos':'neg'}">${inr(drop)}</span></p>
 <p class="note">Costs, yields and prices are sample values. Replace them with your own.</p>`}
$('#cCrop').onchange=fillCalc;['cAcres','cCost','cYield','cPrice'].forEach(i=>$('#'+i).oninput=calc);fillCalc();
/* ---- Sowing Calendar ---- */
$('#calTable').innerHTML='<tr><th>Crop</th>'+MONTHS.map((m,i)=>`<th class="${i+1===nowM?'now':''}">${m}</th>`).join('')+'</tr>'+
 CROPS.map(c=>`<tr><td>${c.e} ${c.name}</td>`+MONTHS.map((m,i)=>{const n=i+1,k=c.sow.includes(n)?'sow':c.harvest.includes(n)?'har':'';return`<td class="${k} ${n===nowM?'now':''}">${k==='sow'?'🌱':k==='har'?'✂️':''}</td>`}).join('')+'</tr>').join('');

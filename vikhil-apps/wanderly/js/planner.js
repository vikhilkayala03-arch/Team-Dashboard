/* Trip planner: round-robin through your interests so each day mixes activity types. */
$('#pDest').innerHTML=DEST.map(d=>`<option value="${d.id}">${d.e} ${d.name}, ${d.country}</option>`).join('');
const INT={relax:'🧘 Relax',food:'🍜 Food',adventure:'🧗 Adventure',culture:'🏛️ Culture',nature:'🌿 Nature'};
$('#pInt').innerHTML=Object.entries(INT).map(([k,v],i)=>`<label class="chk"><input type="checkbox" value="${k}" ${i<3?'checked':''}>${v}</label>`).join('');
const shuf=a=>[...a].sort(()=>Math.random()-.5);
function buildTrip(){const d=DEST.find(x=>x.id===$('#pDest').value),days=Math.min(14,Math.max(1,+$('#pDays').value||1)),ppl=Math.max(1,+$('#pPeople').value||1),tier=$('#pTier').value;
 const ints=$$('#pInt input:checked').map(i=>i.value);if(!ints.length)ints.push('culture');
 const pools=ints.map(k=>shuf(d.acts[k]));let idx=0;const slots=['Morning','Afternoon','Evening'],plan=[];
 for(let n=0;n<days;n++){const day=[];for(let s=0;s<3;s++){const i=idx++%ints.length;if(!pools[i].length)pools[i]=shuf(d.acts[ints[i]]);day.push([slots[s],pools[i].shift()])}plan.push(day)}
 const per=d.cost[tier],total=per*days*ppl,parts=[['Stay',.4],['Food',.25],['Travel',.15],['Activities',.15],['Buffer',.05]];
 $('#tripOut').innerHTML=`<div class="pass"><div class="pass-top"><div><small>TO</small><b>${d.e} ${d.name}</b></div><div><small>DAYS</small><b>${days}</b></div><div><small>TRAVELLERS</small><b>${ppl}</b></div><div><small>ESTIMATED TOTAL</small><b>${inr(total)}</b></div><div><small>BEST TIME</small><b style="font-size:1.1rem">${d.best}</b></div></div>
 <div class="pass-body"><h3>Budget breakdown</h3><div class="budget">${parts.map(([n,p])=>`<div class="bl"><span>${n}</span><div><i style="width:${p*100*2}%"></i></div><b>${inr(total*p)}</b></div>`).join('')}</div><p class="note">About ${inr(per)} per person per day. Estimates only; prices vary by season.</p>
 <h3 style="margin:26px 0 14px">Your itinerary</h3>${plan.map((day,i)=>`<div class="day"><h3>Day ${i+1}</h3>${day.map(([t,a])=>`<div class="slot"><span>${t}</span><div>${a}</div></div>`).join('')}</div>`).join('')}</div></div>`}
$('#mkTrip').onclick=buildTrip;$('#shuffle').onclick=buildTrip;

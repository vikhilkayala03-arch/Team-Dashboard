/* Study planner: each day, hours are shared between subjects by weight = difficulty × (1 + 3/(daysLeft+1)).
   Harder and sooner exams get more time. Exam day shows as "exam". */
let subjects=Store.get('subjects',[]);
const COLORS=['var(--hl)','var(--mint)','var(--sky)','var(--lilac)','#FFC4D1'];
const colorOf=n=>COLORS[Math.max(0,subjects.findIndex(s=>s.name===n))%COLORS.length];
function renderSubjects(){$('#subList').innerHTML=subjects.map((s,i)=>`<div class="row" style="margin:6px 0;justify-content:space-between"><span class="pill" style="--c:${COLORS[i%5]}">${s.name}</span><span>${s.date} · ${['','Easy','Medium','Hard'][s.diff]}</span><button class="btn ghost" data-del="${i}" style="padding:4px 10px">✕</button></div>`).join('')||'<p class="sub">No subjects yet.</p>'}
$('#subForm').onsubmit=e=>{e.preventDefault();subjects.push({name:$('#sName').value.trim(),date:$('#sDate').value,diff:+$('#sDiff').value});Store.set('subjects',subjects);e.target.reset();renderSubjects()};
$('#subList').onclick=e=>{const i=e.target.dataset.del;if(i!=null){subjects.splice(+i,1);Store.set('subjects',subjects);renderSubjects()}};
function buildPlan(){const hours=+$('#hours').value||4,today=parseDay(dayKey()),plan=[];
 const upcoming=subjects.filter(s=>parseDay(s.date)>=today);if(!upcoming.length)return[];
 const last=Math.max(...upcoming.map(s=>+parseDay(s.date)));
 for(let d=new Date(today),n=0;+d<=last&&n<60;d.setDate(d.getDate()+1),n++){
  const act=upcoming.filter(s=>parseDay(s.date)>=d).map(s=>({s,left:Math.round((parseDay(s.date)-d)/864e5)}));
  const study=act.filter(a=>a.left>0),exams=act.filter(a=>a.left===0);
  const W=study.reduce((t,a)=>t+a.s.diff*(1+3/(a.left+1)),0);
  const items=study.map(a=>({name:a.s.name,h:Math.max(.5,Math.round(hours*(a.s.diff*(1+3/(a.left+1))/W)*2)/2),left:a.left}));
  plan.push({date:dayKey(d),items,exams:exams.map(a=>a.s.name)})}
 return plan}
function renderPlan(){const plan=buildPlan(),t=dayKey();Store.set('plan',plan);
 $('#planOut').innerHTML=plan.length?plan.map(p=>`<div class="day ${p.date===t?'today':''}"><b>${parseDay(p.date).toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'})}${p.date===t?' (today)':''}</b><div>${p.items.map(i=>`<span class="pill" style="--c:${colorOf(i.name)}">${i.name} ${i.h}h${i.left===1?' · revise':''}</span>`).join('')}${p.exams.map(n=>`<span class="pill" style="--c:#FF6B8B">📝 ${n} exam</span>`).join('')}</div></div>`).join(''):'<p class="sub">Add at least one subject with a future exam date.</p>';
 markPlanChanged()}
function markPlanChanged(){if(window.refreshHome)refreshHome()}
$('#build').onclick=renderPlan;renderSubjects();if(Store.get('plan',[]).length)renderPlan();

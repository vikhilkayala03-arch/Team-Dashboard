/* Today dashboard: next exam, focus minutes, streak, cards due, today's tasks from the saved plan */
function refreshHome(){
 const subs=Store.get('subjects',[]).filter(s=>parseDay(s.date)>=parseDay(dayKey())).sort((a,b)=>a.date<b.date?-1:1);
 if(subs[0]){const d=Math.round((parseDay(subs[0].date)-parseDay(dayKey()))/864e5);$('#hExam').textContent=d===0?'Today':d+' days';$('#hExamName').textContent=subs[0].name}
 else{$('#hExam').textContent='–';$('#hExamName').textContent='Add one in Planner'}
 $('#hFocus').textContent=(Store.get('focus',{})[dayKey()]||0)+' min';$('#hStreak').textContent=streak()+' days';
 $('#hDue').textContent=dueCards().length;
 const today=(Store.get('plan',[]).find(p=>p.date===dayKey())||{items:[]}).items,done=Store.get('done',{});
 $('#hTasks').innerHTML=today.length?today.map(t=>{const k=dayKey()+t.name;return`<label class="task ${done[k]?'done':''}" style="margin:0"><input type="checkbox" data-t="${k}" ${done[k]?'checked':''}><span>${t.name} · ${t.h} hours${t.left===1?' (revision, exam tomorrow)':''}</span></label>`}).join(''):'<p class="sub">No plan for today. Build one in the Planner.</p>'}
$('#hTasks').onchange=e=>{const k=e.target.dataset.t;if(!k)return;const d=Store.get('done',{});d[k]=e.target.checked;Store.set('done',d);if(e.target.checked)markStudied();refreshHome()};
show(location.hash.slice(1)||'home');

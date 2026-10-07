/* CGPA calculator + attendance planner */
const GP={'O':10,'A+':9,'A':8,'B+':7,'B':6,'C':5,'P':4,'F':0};
let rows=Store.get('grades',[{n:'Maths',c:4,g:'A'},{n:'Physics',c:3,g:'B+'},{n:'English',c:2,g:'A+'}]);
function drawG(){$('#gTable').innerHTML='<tr><th>Subject</th><th>Credits</th><th>Grade</th><th></th></tr>'+rows.map((r,i)=>`<tr><td><input value="${r.n}" data-i="${i}" data-f="n" aria-label="Subject"></td><td><input type="number" min="0" value="${r.c}" data-i="${i}" data-f="c" aria-label="Credits" style="width:70px"></td><td><select data-i="${i}" data-f="g" aria-label="Grade">${Object.keys(GP).map(g=>`<option ${g===r.g?'selected':''}>${g}</option>`).join('')}</select></td><td><button class="btn ghost" data-rm="${i}" style="padding:3px 10px">✕</button></td></tr>`).join('');calcG()}
function calcG(){const cr=rows.reduce((t,r)=>t+(+r.c||0),0),pts=rows.reduce((t,r)=>t+(+r.c||0)*GP[r.g],0);$('#gpa').textContent=cr?(pts/cr).toFixed(2)+' GPA':'–';Store.set('grades',rows)}
$('#gTable').addEventListener('input',e=>{const i=e.target.dataset.i;if(i!=null){rows[i][e.target.dataset.f]=e.target.value;calcG()}});
$('#gTable').addEventListener('click',e=>{if(e.target.dataset.rm!=null){rows.splice(+e.target.dataset.rm,1);drawG()}});
$('#addG').onclick=()=>{rows.push({n:'New subject',c:3,g:'B'});drawG()};
function calcAtt(){const a=+$('#att').value,t=+$('#tot').value,r=(+$('#tgt').value)/100;if(!t||a>t){$('#attPct').textContent='–';$('#attMsg').textContent='Attended classes cannot be more than total classes.';return}
 const pct=a/t*100;$('#attPct').textContent=pct.toFixed(1)+'%';$('#attPct').className='big-num '+(pct>=r*100?'good':'warn');
 if(pct>=r*100){const skip=Math.floor(a/r-t);$('#attMsg').textContent=skip>0?`You can skip up to ${skip} more class${skip>1?'es':''} and stay at ${$('#tgt').value}%.`:`You are just above the limit. Do not skip the next class.`}
 else{const need=Math.ceil((r*t-a)/(1-r));$('#attMsg').textContent=`Attend the next ${need} class${need>1?'es':''} in a row to reach ${$('#tgt').value}%.`}}
['att','tot','tgt'].forEach(i=>$('#'+i).oninput=calcAtt);drawG();calcAtt();

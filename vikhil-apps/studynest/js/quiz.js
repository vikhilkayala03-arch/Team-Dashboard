/* Notes → Quiz. Heuristic "AI": for each sentence, hide the most important word (a number, a Capitalised term, or the longest word)
   and offer 3 distractors taken from other key words in the same notes. */
const STOP=new Set('which their there these those about would could should because between through during before after other where while being having process called known'.split(' '));
function keyWord(sentence,isFirst){const words=sentence.match(/[A-Za-z][A-Za-z-]{3,}|\d+(?:\.\d+)?/g)||[];
 const nums=words.filter(w=>/^\d/.test(w));if(nums.length)return nums[0];
 const caps=words.slice(isFirst?1:1).filter(w=>/^[A-Z]/.test(w)&&!STOP.has(w.toLowerCase()));if(caps.length)return caps[0];
 const ok=words.filter(w=>w.length>=7&&!STOP.has(w.toLowerCase())).sort((a,b)=>b.length-a.length);return ok[0]||null}
function makeQuiz(text){const sents=text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).filter(s=>s.split(' ').length>=6);
 const items=sents.map((s,i)=>({s,k:keyWord(s,true)})).filter(x=>x.k);const pool=[...new Set(items.map(x=>x.k))];
 return items.map(x=>{const wrong=pool.filter(p=>p.toLowerCase()!==x.k.toLowerCase()&&(/^\d/.test(p)===/^\d/.test(x.k))).sort(()=>Math.random()-.5).slice(0,3);
  return{q:x.s.replace(new RegExp(x.k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'_____'),a:x.k,opts:[...wrong,x.k].sort(()=>Math.random()-.5)}}).filter(q=>q.opts.length>=3)}
let qs=[],qi=0,score=0;
function showQ(){const out=$('#quizOut');out.hidden=false;
 if(qi>=qs.length){markStudied();out.innerHTML=`<h3>You got ${score} of ${qs.length}</h3><p class="sub">${score===qs.length?'Perfect! 🎉':'Review the ones you missed, then try again.'}</p><div class="row"><button class="btn hl2" id="again">New quiz</button></div>`;$('#again').onclick=()=>$('#mkQuiz').click();return}
 const q=qs[qi];out.innerHTML=`<p class="hand">Question ${qi+1} of ${qs.length}</p><h3 style="margin:6px 0 10px">${q.q}</h3>`+q.opts.map(o=>`<button class="opt">${o}</button>`).join('');
 out.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=b.textContent===q.a;if(ok)score++;out.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(x.textContent===q.a)x.classList.add('ok')});if(!ok)b.classList.add('bad');setTimeout(()=>{qi++;showQ()},1000)})}
$('#mkQuiz').onclick=()=>{qs=makeQuiz($('#notes').value).sort(()=>Math.random()-.5).slice(0,8);qi=score=0;
 if(qs.length<2){$('#quizOut').hidden=false;$('#quizOut').innerHTML='<p>Not enough material. Paste at least 4–5 full sentences of notes.</p>';return}showQ()};
$('#sampleNotes').onclick=()=>{$('#notes').value='Photosynthesis is the process by which plants convert sunlight into chemical energy. The chloroplast contains chlorophyll, which absorbs light. Plants take in carbon dioxide through small openings called stomata. Glucose is produced during the Calvin cycle in the stroma. Oxygen is released as a by-product of the light reactions. Photosynthesis happens mainly in the leaves of green plants. About 70 percent of the oxygen in the atmosphere comes from ocean organisms.'};

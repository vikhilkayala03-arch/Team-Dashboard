/* Split costs: compute each person's net balance, then greedily match biggest debtor with biggest creditor (fewest payments). */
let S=Store.get('split',{members:[],exp:[]});const save=()=>{Store.set('split',S);drawSplit()};
$('#memForm').onsubmit=e=>{e.preventDefault();const n=$('#mName').value.trim();if(n&&!S.members.includes(n))S.members.push(n);$('#mName').value='';save()};
$('#memList').onclick=e=>{const i=e.target.dataset.rm;if(i!=null){const n=S.members[+i];S.members.splice(+i,1);S.exp=S.exp.filter(x=>x.paid!==n).map(x=>({...x,who:x.who.filter(w=>w!==n)})).filter(x=>x.who.length);save()}};
$('#expForm').onsubmit=e=>{e.preventDefault();const who=$$('#eWho input:checked').map(i=>i.value);
 if(!S.members.length||!who.length){alert('Add travellers and choose who shares this expense.');return}
 S.exp.push({what:$('#eWhat').value.trim(),amt:+$('#eAmt').value,paid:$('#ePaid').value,who});$('#eWhat').value=$('#eAmt').value='';save()};
$('#clearSplit').onclick=()=>{if(confirm('Remove all travellers and expenses?')){S={members:[],exp:[]};save()}};
$('#expTable').onclick=e=>{const i=e.target.dataset.x;if(i!=null){S.exp.splice(+i,1);save()}};
function settle(){const bal=Object.fromEntries(S.members.map(m=>[m,0]));
 S.exp.forEach(x=>{bal[x.paid]+=x.amt;x.who.forEach(w=>bal[w]-=x.amt/x.who.length)});
 const pos=[],neg=[];Object.entries(bal).forEach(([n,v])=>{if(v>.5)pos.push([n,v]);else if(v<-.5)neg.push([n,-v])});
 const pay=[];pos.sort((a,b)=>b[1]-a[1]);neg.sort((a,b)=>b[1]-a[1]);
 while(pos.length&&neg.length){const a=Math.min(pos[0][1],neg[0][1]);pay.push([neg[0][0],pos[0][0],a]);pos[0][1]-=a;neg[0][1]-=a;if(pos[0][1]<.5)pos.shift();if(neg[0][1]<.5)neg.shift()}
 return pay}
function drawSplit(){$('#memList').innerHTML=S.members.map((m,i)=>`<span class="chk">${m} <button class="btn ghost" data-rm="${i}" style="padding:0 8px;box-shadow:none" aria-label="Remove ${m}">✕</button></span>`).join('');
 $('#ePaid').innerHTML=S.members.map(m=>`<option>${m}</option>`).join('');
 $('#eWho').innerHTML=S.members.map(m=>`<label class="chk"><input type="checkbox" value="${m}" checked>${m}</label>`).join('');
 const p=settle(),tot=S.exp.reduce((t,x)=>t+x.amt,0);
 $('#settle').innerHTML=(S.exp.length?`<p class="sub" style="margin:0 0 8px">Total spent: <b>${inr(tot)}</b></p>`:'')+(p.length?p.map(([f,t,a])=>`<div class="owe"><span><b>${f}</b> pays <b>${t}</b></span><b>${inr(a)}</b></div>`).join(''):`<p class="sub">${S.exp.length?'Everyone is settled up. 🎉':'Add travellers and expenses.'}</p>`);
 $('#expTable').innerHTML=S.exp.map((x,i)=>`<tr><td>${x.what}</td><td>${inr(x.amt)}</td><td>${x.paid}</td><td><button class="btn ghost" data-x="${i}" style="padding:2px 10px;box-shadow:none" aria-label="Delete">✕</button></td></tr>`).join('')}
drawSplit();

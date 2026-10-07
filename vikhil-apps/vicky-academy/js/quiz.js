/* Quiz: 4 questions, instant feedback, awards XP once */
(function(){const el=document.getElementById("quiz");if(!el)return;const L=LESSONS[0];let i=0,score=0;
function show(){const q=L.quiz[i];el.innerHTML=`<h3>Question ${i+1} of ${L.quiz.length}</h3><p style="margin-top:8px"><b>${q.q}</b></p>`+q.o.map((o,n)=>`<button class="opt" data-n="${n}">${o}</button>`).join("");
 el.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const ok=+b.dataset.n===q.a;if(ok)score++;
  el.querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(+x.dataset.n===q.a)x.classList.add("ok")});if(!ok)b.classList.add("bad");
  setTimeout(()=>{i++;i<L.quiz.length?show():end()},900)})}
function end(){const pass=score>=3,got=pass&&Store.addXP(L.xp,L.id,"🥢 Etiquette Pro");
 el.innerHTML=`<h3>You scored ${score}/${L.quiz.length}</h3><p class="sub" style="margin-top:8px">${pass?(got?`+${L.xp} XP earned and a new badge: 🥢 Etiquette Pro!`:"Great score. XP for this lesson was already earned."):"Review the steps above and try again – you need 3 correct."}</p><button class="btn" style="margin-top:18px" onclick="location.reload()">Try again</button>`}
show()})();

/* Renders the lesson steps on the Learn page */
(function(){const el=document.getElementById("lesson");if(!el)return;const L=LESSONS[0];
el.innerHTML=`<span class="tag">${L.country} • Lesson 4</span><h2>${L.title}</h2>`+L.steps.map(s=>`<div class="step"><span class="e">${s.e}</span><div><b>${s.t}</b><br><span class="sub" style="font-size:1rem">${s.d}</span></div></div>`).join("");
const sk=document.getElementById("skills");if(sk)sk.innerHTML=SKILLS.map((x,i)=>`<button class="card skill" data-skill="${i}"><div class="ico">${x.e}</div><h3>${x.t}</h3><p>${x.d}</p><span class="more2">Open lesson →</span></button>`).join("");})();

/* Core: nav, footer, progress store (localStorage), and the Chef Vicky AI chat */
const Store={
 get(){let s;try{s=JSON.parse(localStorage.getItem("vicky"))}catch(e){}
  s=s||{xp:1240,streak:7,last:"",done:[],badges:[]};
  const today=new Date().toDateString();
  if(s.last!==today){const y=new Date(Date.now()-864e5).toDateString();s.streak=s.last===y?s.streak+1:(s.last?1:s.streak);s.last=today;this.save(s)}
  return s},
 save(s){try{localStorage.setItem("vicky",JSON.stringify(s))}catch(e){}},
 addXP(n,key,badge){const s=this.get();if(key&&s.done.includes(key))return false;
  s.xp+=n;if(key)s.done.push(key);if(badge&&!s.badges.includes(badge))s.badges.push(badge);this.save(s);return true},
 level(xp){return Math.floor(xp/250)+1}
};
const ROOT=document.body.dataset.root||"";
const PAGES=[["index.html","Home"],["pages/destinations.html","Explore"],["pages/learn.html","Learn"],["pages/scanner.html","AI Scanner"],["pages/markets.html","Adventures"],["pages/recipes.html","Recipes"]];
function chrome(){
 const cur=location.pathname.split("/").pop()||"index.html";
 document.body.insertAdjacentHTML("afterbegin",`<header class="nav"><div class="wrap"><a class="logo" href="${ROOT}index.html">🍜 <b>Vicky</b> Academy</a>
 <button class="burger" aria-label="Menu" onclick="document.querySelector('.links').classList.toggle('show')">☰</button>
 <nav class="links">${PAGES.map(p=>`<a href="${ROOT}${p[0]}" class="${p[0].endsWith(cur)?"on":""}">${p[1]}</a>`).join("")}</nav>
 <a class="pill" href="${ROOT}pages/profile.html">👤 Profile</a></div></header>`);
 document.body.insertAdjacentHTML("beforeend",`<footer><b>🍜 Vicky Academy</b><br>Learn • Taste • Travel</footer>
 <button id="chatBtn">🤖 Ask Chef Vicky</button>
 <div id="chat" role="dialog" aria-label="Chef Vicky AI"><header>🤖 Chef Vicky – your food guide</header><div id="msgs"></div>
 <form id="cf"><input id="ci" placeholder="Ask about a dish, country or etiquette" aria-label="Question"><button>Send</button></form></div>`);
 const say=(t,w)=>{const d=document.createElement("div");d.className="m "+w;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=1e9};
 say("Hi! Ask me what a dish is (try “what is biryani?”), about a country, or dining etiquette.","bot");
 chatBtn.onclick=()=>chat.classList.toggle("open");
 cf.onsubmit=async e=>{e.preventDefault();const q=ci.value.trim();if(!q)return;ci.value="";say(q,"me");say(await Brain.ask(q),"bot")};
}
/* Offline AI: matches intent + knowledge base. If AI_ENDPOINT is set, asks your real AI first. */
const Brain={
 find(text){const t=text.toLowerCase();return DISHES.filter(d=>d.k.some(k=>t.includes(k)))},
 describe(d){return `${d.e} ${d.name} (${d.c}): ${d.mean} Made with ${d.ing.join(", ")}. Allergens: ${d.al.join(", ")}. ${d.story}`},
 async ask(q){
  if(typeof AI_ENDPOINT==="string"&&AI_ENDPOINT){try{const r=await fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});const j=await r.json();if(j.answer)return j.answer}catch(e){}}
  const t=q.toLowerCase(),hit=this.find(t);
  if(hit.length)return hit.map(d=>this.describe(d)).join("\n\n");
  const c=COUNTRIES.find(c=>t.includes(c.name.toLowerCase()));
  if(c)return `${c.emoji} ${c.name}: ${c.desc} Useful phrase: ${c.phrase}. Dishes I know: ${DISHES.filter(d=>d.c===c.name).map(d=>d.name).join(", ")||"coming soon"}.`;
  const sd=Object.keys(SKILL_DETAIL).find(k=>t.includes(k.toLowerCase().split(" ")[0]));
  if(sd){const d=SKILL_DETAIL[sd];return "📘 "+sd+": "+d.intro+" Tips: "+d.tips.join(" ")}
  if(/chopstick|etiquette|tip|manners/.test(t))return LESSONS[0].steps.map(s=>s.e+" "+s.t+": "+s.d).join("\n");
  if(/allerg/.test(t))return "Paste a menu into the AI Scanner and I will flag common allergens for each dish. Always confirm with the restaurant.";
  return "I don't know that one yet. Try a dish name (ramen, biryani, carbonara…), a country, or ask about etiquette.";
 }
};
chrome();

/* Skill lesson popup: opens when a cooking-skill card is clicked */
document.body.insertAdjacentHTML("beforeend",`<div id="sk" role="dialog" aria-modal="true" aria-label="Skill lesson"><div class="panel"><button class="x" aria-label="Close">✕</button><div id="skBody"></div></div></div>`);
function openSkill(i){const s=SKILLS[i],d=SKILL_DETAIL[s.t];if(!d)return;const done=Store.get().done.includes("skill-"+s.t);
 skBody.innerHTML=`<div style="font-size:3rem">${s.e}</div><h2>${s.t}</h2><p class="sub" style="margin-top:8px">${d.intro}</p>`+
 d.sections.map(x=>`<h3 class="sec">${x.h}</h3>`+x.list.map(r=>`<div class="step"><span class="e">${r[0]}</span><div><b>${r[1]}</b><br><span class="sub" style="font-size:1rem">${r[2]}</span></div></div>`).join("")).join("")+
 `<div class="tips"><b>💡 Chef tips</b><ul>${d.tips.map(t=>`<li>${t}</li>`).join("")}</ul></div>
 <div class="row"><button class="btn" id="skDone" ${done?"disabled":""}>${done?"✓ Learned":"Mark as learned (+20 XP)"}</button><button class="btn ghost" id="skAsk">Ask Chef Vicky</button></div>`;
 skDone.onclick=()=>{if(Store.addXP(20,"skill-"+s.t,"📘 "+s.t)){skDone.textContent="✓ Learned +20 XP";skDone.disabled=true}};
 skAsk.onclick=()=>{sk.classList.remove("open");chat.classList.add("open");ci.value="Give me a tip about "+s.t.toLowerCase();ci.focus()};
 sk.classList.add("open");sk.querySelector(".x").focus()}
document.addEventListener("click",e=>{const c=e.target.closest("[data-skill]");if(c)openSkill(+c.dataset.skill);else if(e.target===sk||e.target.closest("#sk .x"))sk.classList.remove("open")});
document.addEventListener("keydown",e=>{if(e.key==="Escape")sk.classList.remove("open")});

/* Profile: level, XP, streak, badges. Also fills the home page stat card + country grid. */
(function(){const s=Store.get(),lv=Store.level(s.xp),into=s.xp%250;
const set=(id,v)=>{const e=document.getElementById(id);if(e)e.innerHTML=v};
set("streak",s.streak+" days");set("xpTxt",`${s.xp.toLocaleString()} XP`);set("lvl","Level "+lv+" → "+(lv+1));
const b=document.getElementById("xpBar");if(b)b.style.width=Math.round(into/250*100)+"%";
set("pStats",`<div class="card skill"><h3>🔥 ${s.streak}</h3><p>day streak</p></div><div class="card skill"><h3>⭐ ${s.xp}</h3><p>total XP</p></div><div class="card skill"><h3>🏆 ${lv}</h3><p>level</p></div><div class="card skill"><h3>🌍 ${s.badges.length}</h3><p>badges earned</p></div>`);
set("badges",s.badges.length?s.badges.map(x=>`<span class="badge" style="font-size:1rem;padding:8px 16px">${x}</span>`).join(""):`<p class="sub">No badges yet. Finish a quiz or an adventure to earn your first.</p>`);
const rs=document.getElementById("reset");if(rs)rs.onclick=()=>{if(confirm("Reset all progress?")){localStorage.removeItem("vicky");location.reload()}};
const cg=document.getElementById("countries");if(cg){const p=document.body.dataset.root||"";cg.innerHTML=COUNTRIES.map(c=>`<article class="card"><div class="top" style="background:${c.bg}">${c.emoji}</div><div class="body"><span class="region">${c.region}</span><h3>${c.name}</h3><p>${c.desc}</p>${cg.dataset.full?`<p><b>Say it:</b> ${c.phrase}</p>`:""}<a class="more" href="${p}pages/learn.html">Explore ${c.name} →</a></div></article>`).join("")}
const ad=document.getElementById("advHome");if(ad)ad.innerHTML=ADVENTURES.slice(0,3).map(a=>`<a class="card" href="${document.body.dataset.root||""}pages/markets.html"><div class="top" style="background:${a.bg}">${a.e}</div><div class="body"><span class="region">+${a.xp} XP</span><h3>${a.t}</h3><p>${a.d}</p></div></a>`).join("");
const sk=document.getElementById("skillsHome");if(sk)sk.innerHTML=SKILLS.map((x,i)=>`<button class="card skill" data-skill="${i}"><div class="ico">${x.e}</div><h3>${x.t}</h3><p>${x.d}</p><span class="more2">Open lesson →</span></button>`).join("");
})();

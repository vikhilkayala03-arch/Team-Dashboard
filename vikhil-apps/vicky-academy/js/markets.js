/* Adventures: complete challenges for XP + badges. Also renders recipes. */
(function(){const el=document.getElementById("adv");if(el){const done=Store.get().done;
el.innerHTML=ADVENTURES.map(a=>`<div class="card"><div class="top" style="background:${a.bg}">${a.e}</div><div class="body"><span class="region">REWARD +${a.xp} XP</span><h3>${a.t}</h3><p>${a.d}</p><button class="more" data-id="${a.id}" data-xp="${a.xp}" ${done.includes("adv-"+a.id)?"disabled":""}>${done.includes("adv-"+a.id)?"✓ Completed":"Mark as done"}</button></div></div>`).join("");
el.onclick=e=>{const b=e.target.closest("button[data-id]");if(!b)return;if(Store.addXP(+b.dataset.xp,"adv-"+b.dataset.id,"🧭 "+b.parentNode.querySelector("h3").textContent)){b.textContent="✓ Completed";b.disabled=true}}}
const r=document.getElementById("recipes");if(r)r.innerHTML=RECIPES.map(x=>`<div class="card"><div class="top" style="background:var(--peach)">${x.e}</div><div class="body"><span class="region">${x.c.toUpperCase()} • ${x.time}</span><h3>${x.t}</h3><p>${x.steps}</p></div></div>`).join("");
})();

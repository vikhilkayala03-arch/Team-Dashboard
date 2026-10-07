/* AI Menu Scanner: paste or type menu lines (or add a photo) -> meaning, ingredients, allergens, story */
(function(){const box=document.getElementById("menu");if(!box)return;
const out=document.getElementById("out"),img=document.getElementById("photo"),prev=document.getElementById("prev");let dataUrl="";
document.getElementById("sample").onclick=()=>{box.value="Tonkotsu Ramen\nPad Thai\nSpaghetti Carbonara\nTempura\nPaneer Tikka\nChef's special";run()};
img.onchange=()=>{const f=img.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{dataUrl=r.result;prev.innerHTML=`<img src="${dataUrl}" alt="Menu photo" style="max-width:260px;border-radius:16px;margin-top:12px">`;
 if(!AI_ENDPOINT)prev.insertAdjacentHTML("beforeend",`<p class="sub" style="font-size:.95rem;margin-top:8px">Reading text from photos needs an AI/OCR endpoint (see README). For now, type the dish names below.</p>`)};r.readAsDataURL(f)};
document.getElementById("scan").onclick=run;
async function run(){const lines=box.value.split("\n").map(s=>s.trim()).filter(Boolean);if(!lines.length&&!dataUrl){out.innerHTML=`<p class="sub">Add at least one dish name or a menu photo, then press Scan.</p>`;return}
 let remote=null;if(AI_ENDPOINT){try{const r=await fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({menu:lines,image:dataUrl})});remote=(await r.json()).dishes}catch(e){}}
 const html=(remote||lines.map(l=>({line:l,hits:Brain.find(l)}))).map(r=>{
  if(r.html)return r.html;const h=r.hits||[];
  if(!h.length)return `<div class="dish"><div class="e">❓</div><div><b>${r.line}</b><br><small>Not in my dish library yet. Ask Chef Vicky or the waiter.</small></div></div>`;
  return h.map(d=>`<div class="dish"><div class="e">${d.e}</div><div><b>${r.line}</b> <small>• ${d.c}</small><p>${d.mean}</p><small>${d.story}</small><div>${d.ing.map(i=>`<span class="badge">${i}</span>`).join("")}${d.al.map(a=>`<span class="badge warn">⚠ ${a}</span>`).join("")}</div></div></div>`).join("")}).join("");
 out.innerHTML=html;if(lines.length)Store.addXP(10,"scan-"+Date.now());}
})();

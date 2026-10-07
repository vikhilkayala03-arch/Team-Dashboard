/* Navigation + home page. Views are <section class="view"> elements shown one at a time. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function show(v){if(!$('#v-'+v))v='home';$$('.view').forEach(x=>x.hidden=x.id!=='v-'+v);
 $$('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.view===v));history.replaceState(null,'','#'+v);scrollTo(0,0)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-view],[data-go]');if(t)show(t.dataset.view||t.dataset.go)});
/* Home: what to sow / harvest in the current month, computed from today's date */
const nowM=new Date().getMonth()+1;
$('#monthName').textContent=new Date().toLocaleString('en',{month:'long'})+' in the field';
const chipList=(arr,cls)=>arr.length?arr.map(c=>`<span class="chip ${cls}">${c.e} ${c.name}</span>`).join(''):'<span class="chip">Nothing major</span>';
$('#sowNow').innerHTML=chipList(CROPS.filter(c=>c.sow.includes(nowM)),'gold');
$('#harNow').innerHTML=chipList(CROPS.filter(c=>c.harvest.includes(nowM)),'');
show(location.hash.slice(1)||'home');

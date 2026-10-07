/* Shared helpers: tab switching, safe localStorage (Store), study-day log */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const Store={get(k,d){try{const v=JSON.parse(localStorage.getItem('sn_'+k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem('sn_'+k,JSON.stringify(v))}catch(e){}}};
const dayKey=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parseDay=s=>new Date(s+'T00:00:00');
function show(v){if(!$('#v-'+v))v='home';$$('.view').forEach(x=>x.hidden=x.id!=='v-'+v);$$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.view===v));history.replaceState(null,'','#'+v);if(window.refreshHome&&v==='home')refreshHome()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-view]');if(t)show(t.dataset.view)});
/* Mark today as a study day (used for the streak) */
function markStudied(){const d=Store.get('days',[]);const k=dayKey();if(!d.includes(k)){d.push(k);Store.set('days',d)}}
function streak(){const d=new Set(Store.get('days',[]));let n=0,c=new Date();if(!d.has(dayKey(c)))c.setDate(c.getDate()-1);while(d.has(dayKey(c))){n++;c.setDate(c.getDate()-1)}return n}

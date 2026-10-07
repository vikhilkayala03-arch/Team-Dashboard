/* Shared helpers: navigation and safe storage */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const Store={get(k,d){try{const v=JSON.parse(localStorage.getItem('wd_'+k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem('wd_'+k,JSON.stringify(v))}catch(e){}}};
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
function show(v){if(!$('#v-'+v))v='home';$$('.view').forEach(x=>x.hidden=x.id!=='v-'+v);$$('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.view===v));
 $('main.page').hidden=v==='home';history.replaceState(null,'','#'+v);scrollTo(0,0)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-view]');if(t)show(t.dataset.view)});
const m=new Date().getMonth()+1,MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
$('#bestNow').textContent='In '+MN[m-1]+', look at: '+DEST.filter(d=>d.best.split(/[,–]/).some(x=>x.trim()===MN[m-1])||inRange(d.best,m)).map(d=>d.e+' '+d.name).join(', ')+'.';
function inRange(txt,month){return txt.split(',').some(p=>{const [a,b]=p.split('–').map(s=>MN.indexOf(s.trim())+1);if(!a)return false;if(!b)return a===month;return a<=b?month>=a&&month<=b:(month>=a||month<=b)})}
$('#bestNow').textContent='In '+MN[m-1]+', look at: '+(DEST.filter(d=>inRange(d.best,m)).map(d=>d.e+' '+d.name).join(', ')||'any destination with a good-weather forecast')+'.';
show(location.hash.slice(1)||'home');

/* Shared browser logic; no framework or external library. */
(function (root) {
  'use strict';
  const aliases = {phone:'Phones',smartphone:'Phones',laptop:'Laptops',notebook:'Laptops',tablet:'Tablets',ipad:'Tablets',earbud:'Audio',headphone:'Audio',audio:'Audio',speaker:'Audio',smartwatch:'Smartwatches',watch:'Smartwatches',console:'Gaming',controller:'Gaming',camera:'Cameras',charger:'Accessories',accessory:'Accessories',accessories:'Accessories',monitor:'Monitors',keyboard:'Accessories',mouse:'Accessories',mice:'Accessories',cable:'Accessories',dock:'Accessories',home:'Smart Home',tv:'Smart Home',television:'Smart Home'};
  const nounPattern=word=>new RegExp(`\\b${word}${word.endsWith('watch')?'(?:es)?':'s?'}\\b`);
  const priorityWords = {camera:'Camera',photography:'Camera',gaming:'Gaming',battery:'Battery',display:'Display',coding:'Productivity',student:'Productivity',students:'Productivity',college:'Productivity',work:'Productivity',productivity:'Productivity',portable:'Portability',travel:'Portability',anc:'Audio',audio:'Audio',performance:'Performance',ai:'AI'};
  function parseQuery(query) {
    const q=String(query).toLowerCase().replace(/,/g,'');
    let category='All';
    for(const [word,cat] of Object.entries(aliases)) if(nounPattern(word).test(q)){category=cat;break;}
    if(['charger','keyboard','mouse','mice','cable','dock'].some(word=>nounPattern(word).test(q)))category='Accessories';
    if(category==='All' && /\bgaming\b/.test(q)) category='Gaming';
    const amount=q.match(/(?:under|below|within|budget|less than)\s*(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d+)?)\s*(lakh|lac|k)?/);
    const budget=amount?Number(amount[1])*(amount[2]==='k'?1000:amount[2]?100000:1):Infinity;
    let priority='Overall';
    for(const [word,p] of Object.entries(priorityWords)) if(new RegExp(`\\b${word}\\b`).test(q)){priority=p;break;}
    return {category,budget,priority};
  }
  function filterProducts(products,query='',category='All',budget=Infinity,priority='Overall') {
    const parsed=parseQuery(query),cat=category==='All'?parsed.category:category;
    const max=Math.min(budget,parsed.budget),pref=priority==='Overall'?parsed.priority:priority;
    const q=String(query).toLowerCase();
    const ignored=new Set(['best','for','under','below','within','budget','less','than','near','me','with','a','the','good','buy','in','devices','gadget','gadgets','and','of','my','smart']);
    const terms=q.replace(/₹|\brs\.?|\d+[,.\d]*(?:\s*(?:k|lakh|lac))?/g,' ').split(/\s+/).filter(w=>w&&!ignored.has(w)&&!priorityWords[w]&&!Object.keys(aliases).some(a=>nounPattern(a).test(w)));
    const subtypes={speaker:'speaker',keyboard:'keyboard',mouse:'mouse',mice:'mouse',charger:'charger',cable:'cable',dock:'dock',controller:'controller',console:'console',tv:'tv',television:'tv'};
    return products.filter(p=>{
      const tags=p.tags.join(' ').toLowerCase();
      return (cat==='All'||p.category===cat)&&p.price<=max&&
        Object.entries(subtypes).every(([word,tag])=>!nounPattern(word).test(q)||tags.split(' ').includes(tag))&&
        (!/\bearbuds?\b|\btws\b/.test(q)||tags.includes('tws')||tags.includes('earbud'))&&
        (!/\bheadphones?\b/.test(q)||tags.includes('headphone'))&&
        (!/\banc\b/.test(q)||tags.includes('anc'))&&
        terms.every(t=>`${p.name} ${p.brand} ${tags}`.toLowerCase().includes(t));
    }).sort((a,b)=>(b.scores[pref]??b.score)-(a.scores[pref]??a.score)||a.price-b.price);
  }
  function toggleComparison(ids,id) {return ids.includes(id)?ids.filter(x=>x!==id):ids.length<4?[...ids,id]:ids;}
  function validTarget(n) {return typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=10000000;}
  function validReview(r) {return !!r&&Number.isInteger(r.rating)&&r.rating>=1&&r.rating<=5&&typeof r.text==='string'&&r.text.trim().length>=5&&r.text.length<=4000&&typeof r.productId==='string';}
  function recommend(products,prefs) {
    const usePriority={Gaming:'Gaming',Photography:'Camera',College:'Productivity',Work:'Productivity',Travel:'Portability','Content creation':'Camera'};
    const uses=(prefs.useCases||[]).map(u=>usePriority[u]).filter(Boolean);
    const rank=p=>{const primary=p.scores[prefs.priority]??p.score;return primary*.7+(uses.length?uses.reduce((n,k)=>n+(p.scores[k]??p.score),0)/uses.length:primary)*.3;};
    return products.filter(p=>(!prefs.categories.length||prefs.categories.includes(p.category))&&p.price<=prefs.budget&&(!prefs.brands.length||prefs.brands.includes(p.brand))).sort((a,b)=>rank(b)-rank(a)||a.price-b.price);
  }
  function escapeHTML(value) {return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function valueScore(p) {return Math.round(Math.max(0,Math.min(10,p.score*.75+Math.max(0,3-p.price/20000)))*10)/10;}
  function normalizeState(raw,ids) {
    const s=raw&&typeof raw==='object'?raw:{};
    const list=(v,limit=100)=>Array.isArray(v)?[...new Set(v.filter(x=>ids.includes(x)))].slice(0,limit):[];
    const strings=(v,limit=30)=>Array.isArray(v)?v.filter(x=>typeof x==='string').map(x=>x.slice(0,200)).slice(0,limit):[];
    const p=s.preferences&&typeof s.preferences==='object'?s.preferences:{};
    const overrides={};
    if(s.overrides&&typeof s.overrides==='object') for(const id of ids){const o=s.overrides[id];if(o&&typeof o==='object')overrides[id]={...(validTarget(o.price)?{price:o.price}:{}),featured:o.featured===true,reviewed:o.reviewed===true};}
    const reviews=Array.isArray(s.reviews)?s.reviews.filter(r=>validReview(r)&&ids.includes(r.productId)).slice(0,200).map(r=>({id:String(r.id).slice(0,100),productId:r.productId,rating:r.rating,text:r.text,date:String(r.date).slice(0,80),media:strings(r.media,3),breakdown:r.breakdown&&typeof r.breakdown==='object'?Object.fromEntries(Object.entries(r.breakdown).filter(([k,v])=>['Performance','Camera','Battery','Display','Build','Software','Value'].includes(k)&&Number.isInteger(v)&&v>=1&&v<=5)):{} })):[];
    return {wishlist:list(s.wishlist),comparisons:list(s.comparisons,4),recent:list(s.recent,20),searches:strings(s.searches,20),reviews,alerts:Array.isArray(s.alerts)?s.alerts.filter(a=>a&&ids.includes(a.productId)&&validTarget(a.target)).slice(0,100).map(a=>({productId:a.productId,target:a.target,types:strings(a.types,4)})):[],preferences:{categories:strings(p.categories),brands:strings(p.brands),budget:validTarget(p.budget)?p.budget:100000,priority:typeof p.priority==='string'?p.priority:'Performance',useCases:strings(p.useCases),notifications:p.notifications!==false},overrides,newsOverrides:s.newsOverrides&&typeof s.newsOverrides==='object'?Object.fromEntries(Object.entries(s.newsOverrides).filter(([,v])=>v&&typeof v.title==='string'&&typeof v.summary==='string').map(([k,v])=>[k,{title:v.title.slice(0,200),summary:v.summary.slice(0,1000)}])):{},onboarded:s.onboarded===true,name:typeof s.name==='string'?s.name.slice(0,60):'Gadget explorer'};
  }
  const api={parseQuery,filterProducts,toggleComparison,validTarget,validReview,recommend,escapeHTML,valueScore,normalizeState,money:n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.GadgetPulseCore=api;
})(typeof window==='undefined'?globalThis:window);

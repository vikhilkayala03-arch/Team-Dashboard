export const SKIN_TYPES=['oily','dry','combination','normal','sensitive'];
export const CONCERNS=['Acne','Dark spots','Pigmentation','Dryness','Oiliness','Uneven skin tone','Dullness','Fine lines'];
export const CATEGORIES=['Cleanser','Toner','Serum','Moisturizer','Sunscreen','Face Mask','Eye Care','Lip Care'];
export const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
export const discount=p=>Math.round((1-p.price/p.mrp)*100);
export function alertStatus(alert,p){return {targetReached:p.price<=alert.target,priceDropped:p.price<alert.lastPrice,discountIncreased:discount(p)>(alert.lastDiscount??discount(p))};}
export function totals(products){
  const original=products.reduce((n,p)=>n+p.mrp,0), total=products.reduce((n,p)=>n+p.price,0);
  return {original,total,savings:original-total,percent:original?Math.round((original-total)/original*100):0};
}
const suits=(p,skin)=>!skin || p.skin.includes(skin);
const fitScore=(p,profile)=>p.rating+(profile.concerns||[]).filter(c=>p.concerns.includes(c)).length*3+(p.fragranceFree&&profile.skin==='sensitive'?2:0);
export function recommendRoutine(catalog,profile){
  const budget=Number(profile.budget);
  if(!Number.isFinite(budget)||budget<=0||budget>100000) throw new RangeError('Choose a budget between ₹1 and ₹1,00,000.');
  const required=['Cleanser','Moisturizer','Sunscreen'];
  const pools=required.map(cat=>catalog.filter(p=>p.category===cat&&suits(p,profile.skin)).sort((a,b)=>a.price-b.price));
  const minimum=pools.every(p=>p.length)?pools.reduce((n,p)=>n+p[0].price,0):Infinity;
  let best=[],bestScore=-Infinity;
  if(minimum<=budget){
    const serums=[null,...catalog.filter(p=>p.category==='Serum'&&suits(p,profile.skin))];
    for(const c of pools[0]) for(const m of pools[1]) for(const s of pools[2]) for(const serum of serums){
      const products=[c,...(serum?[serum]:[]),m,s],cost=totals(products).total;
      if(cost>budget) continue;
      const score=products.reduce((n,p)=>n+fitScore(p,profile),0)+new Set(products.map(p=>p.brand)).size*.7-cost/budget;
      if(score>bestScore){best=products;bestScore=score;}
    }
  } else {
    let remaining=budget;
    for(const pool of pools){if(pool[0]&&pool[0].price<=remaining){best.push(pool[0]);remaining-=pool[0].price;}}
  }
  const reasons=Object.fromEntries(best.map(p=>{
    const concern=(profile.concerns||[]).find(c=>p.concerns.includes(c));
    return [p.id,`${p.category==='Sunscreen'?'Adds daily sun protection':p.category==='Cleanser'?'A cleansing step':p.category==='Moisturizer'?'A hydration step':'A targeted treatment'} for ${profile.skin} skin${concern?`; chosen for your ${concern.toLowerCase()} preference`:''}. ${money(p.price)} leaves room in your budget.`];
  }));
  return {products:best,reasons,incomplete:!required.every(cat=>best.some(p=>p.category===cat)),minimum,remaining:budget-totals(best).total};
}
export function filterProducts(catalog,filters={}){
  let query=(filters.q||'').toLowerCase().trim();
  const priceMatch=query.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/);
  const queryMax=priceMatch?Number(priceMatch[1].replaceAll(',','')):Infinity;
  const maxPrice=filters.max===undefined||filters.max===null||filters.max===''?Infinity:Number(filters.max);
  if(priceMatch) query=query.replace(priceMatch[0],'');
  const querySkin=SKIN_TYPES.find(s=>query.includes(s+' skin'));
  if(querySkin) query=query.replace(querySkin+' skin','');
  const tokens=query.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&!['best','for','skin','product','products','the','a','and','with'].includes(w));
  const list=catalog.filter(p=>{
    const text=[p.name,p.brand,p.category,...p.ingredients,...p.concerns,...p.skin].join(' ').toLowerCase();
    return tokens.every(t=>text.includes(t)) && (!filters.category||p.category===filters.category) && (!filters.brand||p.brand===filters.brand)
      && suits(p,filters.skin||querySkin) && (!filters.concern||p.concerns.includes(filters.concern))
      && (!filters.ingredient||p.ingredients.some(i=>i.toLowerCase().includes(filters.ingredient.toLowerCase())))
      && p.price>=(Number(filters.min)||0) && p.price<=Math.min(maxPrice,queryMax)
      && p.rating>=(Number(filters.rating)||0) && discount(p)>=(Number(filters.discount)||0)
      && ['vegan','crueltyFree','fragranceFree'].every(key=>!filters[key]||p[key]);
  });
  if(filters.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(filters.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(filters.sort==='discount') list.sort((a,b)=>discount(b)-discount(a));
  if(filters.sort==='rating') list.sort((a,b)=>b.rating-a.rating);
  return list;
}
export function alternatives(product,catalog,skin){
  return catalog.filter(p=>p.id!==product.id&&p.category===product.category&&p.price<product.price&&suits(p,skin)).sort((a,b)=>a.price-b.price);
}
export function routineSections(products){
  const morningOrder=['Cleanser','Toner','Serum','Eye Care','Moisturizer','Sunscreen','Lip Care'];
  const nightOrder=['Cleanser','Toner','Serum','Face Mask','Eye Care','Moisturizer','Lip Care'];
  return Object.fromEntries([['morning',morningOrder],['night',nightOrder]].map(([time,order])=>[time,order.flatMap(cat=>products.filter(p=>p.category===cat))]));
}
export function cartTotals(cart,catalog,coupon=''){
  let original=0,subtotal=0,quantity=0;
  for(const item of cart){const p=catalog.find(p=>p.id===item.id);if(!p||!Number.isInteger(item.qty)||item.qty<1||item.qty>99)continue; original+=p.mrp*item.qty;subtotal+=p.price*item.qty;quantity+=item.qty;}
  const couponDiscount=coupon.toUpperCase()==='SKIN10'?Math.min(150,Math.round(subtotal*.1)):0;
  const delivery=subtotal===0||subtotal>=499?0:49;
  return {original,subtotal,productSavings:original-subtotal,couponDiscount,delivery,total:subtotal-couponDiscount+delivery,savings:original-subtotal+couponDiscount,quantity};
}
export function sanitizeState(input,catalog){
  const s=input&&typeof input==='object'?input:{};
  const ids=new Set(catalog.map(p=>p.id));
  const validIds=value=>Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&ids.has(id)))]:[];
  const kitIds=value=>{const seen=new Set();return validIds(value).filter(id=>{const cat=catalog.find(p=>p.id===id).category;if(seen.has(cat))return false;seen.add(cat);return true;});};
  const safeText=(value,max=80)=>typeof value==='string'?value.slice(0,max):'';
  const validBudget=value=>Number.isFinite(Number(value))&&Number(value)>=100&&Number(value)<=100000?Number(value):1500;
  const cart=value=>Array.isArray(value)?value.filter(i=>i&&ids.has(i.id)&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<=99).reduce((a,i)=>{const old=a.find(v=>v.id===i.id);if(old)old.qty=Math.min(99,old.qty+i.qty);else a.push({id:i.id,qty:i.qty});return a;},[]):[];
  return {
    profile:{skin:SKIN_TYPES.includes(s.profile?.skin)?s.profile.skin:'combination',concerns:Array.isArray(s.profile?.concerns)?s.profile.concerns.filter(c=>CONCERNS.includes(c)):['Dullness'],budget:validBudget(s.profile?.budget)},
    kit:kitIds(s.kit),wishlist:validIds(s.wishlist),cart:cart(s.cart),recent:validIds(s.recent).slice(0,12),
    savedKits:Array.isArray(s.savedKits)?s.savedKits.filter(k=>k&&typeof k.name==='string'&&Array.isArray(k.ids)).slice(0,30).map(k=>({id:safeText(k.id),name:safeText(k.name),ids:kitIds(k.ids),budget:validBudget(k.budget),date:safeText(k.date)})):[],
    alerts:Array.isArray(s.alerts)?s.alerts.filter(a=>a&&ids.has(a.id)&&Number.isFinite(a.target)&&a.target>0).map(a=>({id:a.id,target:a.target,lastPrice:Number.isFinite(a.lastPrice)?a.lastPrice:catalog.find(p=>p.id===a.id).price,lastDiscount:Number.isFinite(a.lastDiscount)?a.lastDiscount:discount(catalog.find(p=>p.id===a.id))})):[],
    orders:Array.isArray(s.orders)?s.orders.filter(o=>o&&typeof o.id==='string'&&Number.isFinite(o.total)&&o.total>=0).slice(0,30).map(o=>({id:safeText(o.id),date:safeText(o.date),total:o.total,items:cart(o.items)})):[],
    preferences:{vegan:!!s.preferences?.vegan,fragranceFree:!!s.preferences?.fragranceFree,crueltyFree:!!s.preferences?.crueltyFree},coupon:s.coupon==='SKIN10'?'SKIN10':''
  };
}

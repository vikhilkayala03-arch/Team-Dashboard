export const money=n=>'₹'+Number(n).toLocaleString('en-IN');
export const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function filterProducts(items,f={}){
  const search=String(f.search||'').toLowerCase();
  const limit=search.match(/under\s*[₹rs.\s]*([\d,]+)/i);
  const stop=new Set(['under','rental','rent','buy','for','a','the','designer','clothes','clothing','men','women','s','rs']);
  const tokens=search.replace(/[₹\d,.'’]/g,' ').split(/\s+/).filter(t=>t&&!stop.has(t));
  return items.filter(p=>{
    const price=f.mode==='Buy'?p.sale:p.price;
    const text=[p.name,p.category,p.brand,p.style,p.color,p.gender,...p.occasions].join(' ').toLowerCase();
    const unavailable=[...p.booked,...(f.reservations||[]).filter(r=>r.productId===p.id&&r.status!=='Cancelled').flatMap(r=>r.dates||[])];
    const available=!f.date||!rentalDates(f.date,Number(f.duration||3)).some(d=>unavailable.includes(d));
    return !p.sold&&available&&tokens.every(t=>text.includes(t))&&(!limit||price<=Number(limit[1].replaceAll(',','')))&&(!f.mode||p.mode.includes(f.mode))&&(!f.category||p.category===f.category)&&(!f.occasion||p.occasions.includes(f.occasion))&&(!f.gender||p.gender===f.gender||p.gender==='Unisex')&&(!f.size||p.sizes.includes(f.size))&&(!f.brand||p.brand===f.brand)&&(!f.color||p.color===f.color)&&(!f.style||p.style===f.style)&&(!f.location||p.location===f.location)&&(!f.condition||p.condition===f.condition)&&(!f.kind||p.kind===f.kind)&&(!f.rating||p.rating>=Number(f.rating))&&(!f.maxPrice||price<=Number(f.maxPrice))&&(!f.available||!p.hidden);
  }).sort((a,b)=>f.sort==='low'?(f.mode==='Buy'?a.sale-b.sale:a.price-b.price):f.sort==='high'?(f.mode==='Buy'?b.sale-a.sale:b.price-a.price):f.sort==='rating'?b.rating-a.rating:0);
}
export function rentalDates(start,duration){if(!/^\d{4}-\d{2}-\d{2}$/.test(start))return [];const d=new Date(start+'T00:00:00Z');if(Number.isNaN(+d)||d.toISOString().slice(0,10)!==start)return [];return Array.from({length:duration},(_,i)=>new Date(+d+i*86400000).toISOString().slice(0,10));}
export function validateRental({start,duration,size,product,reservations=[],today}){
  const dates=rentalDates(start,Number(duration));
  if(![1,3,7].includes(Number(duration))||dates.length!==Number(duration))return 'Choose a valid start date and duration.';
  if(start<today)return 'Choose today or a future date.';
  if(!product.sizes.includes(size))return 'Choose an available size.';
  const unavailable=[...product.booked,...reservations.filter(r=>r.productId===product.id&&r.status!=='Cancelled').flatMap(r=>r.dates||[])];
  if(dates.some(d=>unavailable.includes(d)))return 'These dates overlap an existing booking. Please choose another date.';
  return '';
}
export function swapScore(item,p,wanted=''){
  const weights={category:18,size:15,brand:8,style:10,color:6,gender:8,location:10,condition:5};
  let score=0;for(const[key,w]of Object.entries(weights)){const match=key==='category'?(wanted||item.category)===p.category:key==='size'?p.sizes.includes(item.size):key==='gender'?item.gender===p.gender||item.gender==='Unisex'||p.gender==='Unisex':item[key]===p[key];if(match)score+=w;}
  const pv=p.sale||p.value,iv=Number(item.value);score+=20*Math.max(0,1-Math.abs(pv-iv)/Math.max(pv,iv,1));return Math.round(score);
}
export function estimate(original,condition){const factor=condition==='Like New'?.65:condition==='Excellent'?.55:.4;const sell=Math.round(Number(original)*factor);return {sell,rent:Math.max(99,Math.round(sell*.14)),swap:Math.round(sell*.94),low:Math.round(sell*.9),high:Math.round(sell*1.1),demand:Number(original)>10000?'Occasion-led':'Steady',best:Number(original)>10000?'Rent it out':'Sell it'};}
export function buildLook(items,{occasion,style,budget}){
  const main=items.filter(p=>!['Accessories','Jewellery','Shoes'].includes(p.category)&&p.mode.includes('Rent')&&p.price<=budget).sort((a,b)=>((b.occasions.includes(occasion)?3:0)+(b.style===style?2:0))-((a.occasions.includes(occasion)?3:0)+(a.style===style?2:0))||a.price-b.price)[0];
  if(!main)return [];let total=main.price;const result=[main];for(const p of items.filter(p=>p.category==='Accessories').sort((a,b)=>a.price-b.price)){if(total+p.price<=budget){result.push(p);total+=p.price;}}return result;
}

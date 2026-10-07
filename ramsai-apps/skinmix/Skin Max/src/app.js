import {products} from './catalog.js';
import {loadState,persistState} from './store.js';
import {header,bottomNav,renderHome,renderDiscover,renderBuilder,renderProduct,renderDeals,renderWishlist,renderProfile,renderCart,renderCheckout,renderOrderSuccess,productArt,esc} from './views.js';
import {money,totals,recommendRoutine,filterProducts,alternatives,cartTotals,sanitizeState,SKIN_TYPES,CONCERNS,alertStatus,discount} from './core.js';
import {icon} from './icons.js';

let state=loadState();
const ui={filters:{...state.preferences},builderStep:state.kit.length?2:1,builderCategory:'Cleanser',reasons:{},incomplete:false,minimum:0,dealTab:'flash',lastOrder:null};
const main=document.querySelector('#main'),dialog=document.querySelector('#dialog');
const product=id=>products.find(p=>p.id===id);
let storageNotice=false;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3500);}
function save(){if(!persistState(state)&&!storageNotice){storageNotice=true;toast('Browser storage is unavailable. Your mix will last until this page closes.');}}
function currentRoute(){return (location.hash.slice(1).split('?')[0]||'home');}
function render(){
 const route=currentRoute(),base=route.split('/')[0];
 document.querySelector('#header').innerHTML=header(state,base);
 document.querySelector('#bottom-nav').innerHTML=bottomNav(base);
 const views={home:()=>renderHome(state),discover:()=>renderDiscover(state,ui),builder:()=>renderBuilder(state,ui),deals:()=>renderDeals(state,ui),wishlist:()=>renderWishlist(state),profile:()=>renderProfile(state),cart:()=>renderCart(state),checkout:()=>renderCheckout(state),success:()=>ui.lastOrder?renderOrderSuccess(ui.lastOrder):renderProfile(state)};
 main.innerHTML=base==='product'?renderProduct(product(route.split('/')[1]),state):(views[base]||views.home)();
 document.querySelector('#search-input').value=ui.filters.q||'';
 document.title=`SkinMix — ${base==='home'?'Your skin. Your mix.':base==='builder'?'Build My Kit':base==='product'?(product(route.split('/')[1])?.name||'Discover'):base[0].toUpperCase()+base.slice(1)}`;
}
function navigate(route){if(currentRoute()===route){render();window.scrollTo({top:0});}else location.hash=route;}
function goDiscover(filters){ui.filters={...state.preferences,...filters};navigate('discover');}
function addToKit(p){
 if(!p)return;
 const replaced=state.kit.map(product).find(v=>v.category===p.category);
 state.kit=state.kit.filter(id=>product(id).category!==p.category);state.kit.push(p.id);
 delete ui.reasons[p.id];save();render();toast(replaced&&replaced.id!==p.id?`${p.category} replaced. Your total is updated.`:'Added to your kit. A little more you.');
}
function addToCart(p){if(!p)return;const old=state.cart.find(i=>i.id===p.id);if(old)old.qty=Math.min(99,old.qty+1);else state.cart.push({id:p.id,qty:1});save();render();toast('Added to your shopping bag.');}
function rememberProduct(){if(currentRoute().startsWith('product/')){const p=product(currentRoute().split('/')[1]);if(p){state.recent=[p.id,...state.recent.filter(id=>id!==p.id)].slice(0,12);save();}}}
function openDialog(title,body){dialog.innerHTML=`<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button data-action="close-dialog" aria-label="Close dialog">${icon('close')}</button></div>${body}`;if(!dialog.open)dialog.showModal();}
function closeDialog(){if(dialog.open)dialog.close();}
function showAlternatives(p){
 const list=alternatives(p,products,state.profile.skin);
 openDialog('A little less spend.',`<p class="small muted">Cheaper ${p.category.toLowerCase()} choices for ${state.profile.skin} skin. Current pick: ${money(p.price)}.</p>${list.length?list.map(q=>`<article class="alternative-row"><a href="#product/${q.id}" class="mini-product-art" data-action="close-dialog">${productArt(q)}</a><div><span class="brand-name">${q.brand}</span><h3>${q.name}</h3><p>${q.ingredients.join(', ')} · ★ ${q.rating}</p><p>${q.skin.join(', ')} skin</p><strong>${money(q.price)}</strong><span class="green-text">Save ${money(p.price-q.price)} more</span></div><button class="button primary" data-action="replace-kit" data-id="${q.id}">Choose</button></article>`).join(''):'<div class="inline-notice">You already have the lowest-priced sample match for your skin type.</div>'}`);
}
function showAllAlternatives(){
 const rows=state.kit.map(product).map(p=>({p,q:alternatives(p,products,state.profile.skin)[0]})).filter(v=>v.q);
 openDialog('Make room in your budget.',`<p class="small muted">Swap any step with a cheaper sample choice that matches your skin.</p>${rows.length?rows.map(({p,q})=>`<article class="alternative-row"><div><span class="brand-name">${p.category}</span><h3>${q.brand} · ${q.name}</h3><p>${q.ingredients.join(', ')} · ★ ${q.rating}</p><p>Replace ${p.brand} · ${money(p.price)} with ${money(q.price)}</p><strong class="green-text">Save ${money(p.price-q.price)} more</strong></div><button class="button primary" data-action="replace-kit" data-id="${q.id}">Swap</button></article>`).join(''):'<div class="inline-notice">Your selected products are already the lowest-priced sample matches. You can also remove an optional step.</div>'}`);
}
function makeRoutine(profile){
 const result=recommendRoutine(products,profile);state.profile=profile;state.kit=result.products.map(p=>p.id);ui.reasons=result.reasons;ui.incomplete=result.incomplete;ui.minimum=result.minimum;ui.builderStep=2;save();navigate('builder');toast(result.incomplete?'Your budget needs a little more room for all essentials.':'Your personalized mix is ready.');return result;
}
async function copyText(text,message){try{await navigator.clipboard.writeText(text);toast(message);}catch{const input=dialog.querySelector('input');if(input){input.focus();input.select();}toast('Select the link and copy it to share your mix.');}}
function importSharedKit(){
 if(!location.hash.includes('?'))return;
 const params=new URLSearchParams(location.hash.split('?')[1]);
 if(params.has('kit')){const ids=params.get('kit').split(',').slice(0,8),budget=Number(params.get('budget'));const next=sanitizeState({...state,kit:ids,profile:{...state.profile,budget}},products);if(next.kit.length){state.kit=next.kit;state.profile.budget=next.profile.budget;ui.builderStep=2;ui.reasons={};save();toast('Shared mix loaded. Make it your own.');}history.replaceState(null,'',location.pathname+location.search+'#builder');}
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');
 if(!b){const anchor=e.target.closest('a[href="#builder"]');if(anchor&&currentRoute()==='builder'){e.preventDefault();ui.builderStep=1;render();window.scrollTo(0,0);}const s=document.querySelector('#suggestions');if(s&&!e.target.closest('.search-form'))s.hidden=true;return;}
 const a=b.dataset.action,p=product(b.dataset.id);
 if(a==='close-dialog'){closeDialog();return;}
 if(a==='wishlist'&&p){const was=state.wishlist.includes(p.id);state.wishlist=was?state.wishlist.filter(id=>id!==p.id):[...state.wishlist,p.id];save();render();toast(was?'Removed from your wishlist.':'Saved a little love to your wishlist.');}
 else if(a==='add-kit'&&p)addToKit(p);
 else if(a==='add-cart'&&p)addToCart(p);
 else if(a==='category')goDiscover({category:b.dataset.category});
 else if(a==='concern')goDiscover({concern:b.dataset.concern});
 else if(a==='skin')goDiscover({skin:b.dataset.skin});
 else if(a==='clear-filters'){ui.filters={};render();}
 else if(a==='remove-filter'){delete ui.filters[b.dataset.key];render();}
 else if(a==='search-suggestion'){goDiscover({q:b.dataset.query});}
 else if(a==='builder-step'){ui.builderStep=Number(b.dataset.step);render();window.scrollTo({top:0});}
 else if(a==='builder-category'){ui.builderCategory=b.dataset.category;render();document.querySelector('#builder-products')?.scrollIntoView({block:'start'});}
 else if(a==='replace-category'){ui.builderCategory=b.dataset.category;ui.builderStep=2;render();document.querySelector('#builder-products')?.scrollIntoView({block:'start'});}
 else if(a==='remove-kit'&&p){state.kit=state.kit.filter(id=>id!==p.id);delete ui.reasons[p.id];save();render();toast('Removed from your kit.');}
 else if(a==='alternatives'&&p)showAlternatives(p);
 else if(a==='all-alternatives')showAllAlternatives();
 else if(a==='replace-kit'&&p){closeDialog();addToKit(p);}
 else if(a==='budget-kit'){state.profile.budget=Number(b.dataset.budget);ui.builderStep=1;save();navigate('builder');}
 else if(a==='save-kit'){
  if(!state.kit.length){toast('Add products before saving your kit.');return;}
  openDialog('Keep your favourite mix.',`<form id="save-kit-form" class="modal-form"><p>A daily routine, a winter mix, or a little care for college. Give this kit a name.</p><label>Kit name<input name="name" maxlength="60" minlength="1" required placeholder="My Daily Routine" value="My Daily Routine"></label><button class="button primary" type="submit">Save My Kit</button></form>`);
 }
 else if(a==='share-kit'){
  const url=new URL(location.href);url.hash=`builder?kit=${state.kit.join(',')}&budget=${state.profile.budget}`;
  openDialog('A little mix to share.',`<div class="modal-form"><p>This link shares the products and budget in your kit. Your personal skin profile stays on your device.</p><label>Kit link<input class="share-input" value="${esc(url.href)}" readonly></label><button class="button primary" data-action="copy-share">${icon('share')} Copy Kit Link</button></div>`);
 }
 else if(a==='copy-share')await copyText(dialog.querySelector('input').value,'Your kit link is copied.');
 else if(a==='load-kit'){const k=state.savedKits.find(k=>k.id===b.dataset.id);if(k){state.kit=[...k.ids];state.profile.budget=k.budget;ui.reasons={};ui.incomplete=false;ui.builderStep=2;save();navigate('builder');toast('Your saved mix is ready.');}}
 else if(a==='delete-saved'){state.savedKits=state.savedKits.filter(k=>k.id!==b.dataset.id);save();render();toast('Saved kit removed.');}
 else if(a==='kit-cart'){for(const id of state.kit){if(!state.cart.some(i=>i.id===id))state.cart.push({id,qty:1});}save();navigate('cart');toast('Your whole mix is in the bag.');}
 else if(a==='deal-tab'){ui.dealTab=b.dataset.tab;render();}
 else if(a==='copy-coupon'){state.coupon='SKIN10';save();toast('SKIN10 applied to your next demo cart.');}
 else if(a==='quantity'){const i=state.cart.find(i=>i.id===b.dataset.id);if(i){i.qty=Math.max(1,Math.min(99,i.qty+Number(b.dataset.delta)));save();render();}}
 else if(a==='remove-cart'){state.cart=state.cart.filter(i=>i.id!==b.dataset.id);save();render();toast('Removed from your bag.');}
 else if(a==='remove-coupon'){state.coupon='';save();render();toast('Coupon removed.');}
 else if(a==='price-alert'&&p){const alert=state.alerts.find(v=>v.id===p.id);openDialog('A price that feels right.',`<form id="alert-form" class="modal-form" data-id="${p.id}"><p>${p.name} · current sample price ${money(p.price)}. Set a target price. Alerts are checked on this device when you open the app; no live feed or outbound notifications are connected.</p><label>Target price (₹)<input type="number" min="1" max="100000" step="1" name="target" value="${alert?.target||Math.floor(p.price*.85)}" required></label><button class="button primary" type="submit">${icon('bell')} Save Price Alert</button></form>`);}
 else if(a==='remove-alert'){state.alerts=state.alerts.filter(v=>v.id!==b.dataset.id);save();render();toast('Price alert removed.');}
 else if(a==='seller-cart'&&p){if(b.dataset.seller==='0')addToCart(p);else{const s=p.sellers[Number(b.dataset.seller)];openDialog('Compare before you mix.',`<div class="modal-form"><p>${s.name} has a sample offer of <strong>${money(s.price)}</strong>. SkinMix’s best sample price is <strong>${money(p.price)}</strong>.</p><p>These are illustrative seller prices; no external store or checkout is connected.</p><button class="button primary" data-action="best-seller-cart" data-id="${p.id}">Add Best Price to Cart</button></div>`);}}
 else if(a==='best-seller-cart'&&p){closeDialog();addToCart(p);}
});
document.addEventListener('submit',e=>{
 const f=e.target;if(!(f instanceof HTMLFormElement))return;e.preventDefault();
 const data=new FormData(f);
 if(f.id==='search-form'){goDiscover({q:String(data.get('q')||'').trim()});}
 else if(f.id==='filters-form'){ui.filters={...ui.filters,...Object.fromEntries(data.entries()),vegan:data.has('vegan'),crueltyFree:data.has('crueltyFree'),fragranceFree:data.has('fragranceFree')};render();}
 else if(f.id==='routine-form'||f.id==='profile-form'){
  const profile={skin:String(data.get('skin')),concerns:data.getAll('concerns'),budget:Number(data.get('budget'))};
  if(!SKIN_TYPES.includes(profile.skin)||!Number.isFinite(profile.budget)||profile.budget<100||profile.budget>100000){toast('Choose your skin type and a budget of ₹100–₹1,00,000.');return;}
  if(f.id==='routine-form')makeRoutine(profile);
  else{state.profile=profile;state.preferences={vegan:data.has('vegan'),crueltyFree:data.has('crueltyFree'),fragranceFree:data.has('fragranceFree')};save();render();toast('Your skin profile is saved.');}
 }
 else if(f.id==='save-kit-form'){
  const name=String(data.get('name')||'').trim();if(!name){toast('Give your mix a name.');return;}
  state.savedKits.unshift({id:crypto.randomUUID(),name:name.slice(0,60),ids:[...state.kit],budget:state.profile.budget,date:new Date().toISOString()});state.savedKits=state.savedKits.slice(0,30);save();closeDialog();toast('Your mix is saved. Find it in your profile.');
 }
 else if(f.id==='alert-form'){const p=product(f.dataset.id),target=Number(data.get('target'));if(!p||!Number.isFinite(target)||target<1||target>100000)return;state.alerts=state.alerts.filter(a=>a.id!==p.id);state.alerts.push({id:p.id,target,lastPrice:p.price,lastDiscount:discount(p)});save();closeDialog();render();toast(p.price<=target?'Target reached at the current sample price.':'Your device-local price alert is saved.');}
 else if(f.id==='coupon-form'){const coupon=String(data.get('coupon')||'').trim().toUpperCase();if(coupon!=='SKIN10'){toast('That demo code is not available. Try SKIN10.');return;}state.coupon=coupon;save();render();toast('A little extra saving. SKIN10 applied.');}
 else if(f.id==='checkout-form'){
  if(!f.reportValidity()||!state.cart.length)return;
  const order={id:'SM-DEMO-'+Date.now().toString(36).toUpperCase(),date:new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date()),total:cartTotals(state.cart,products,state.coupon).total,items:state.cart.map(i=>({...i}))};
  state.orders.unshift(order);state.orders=state.orders.slice(0,30);state.cart=[];state.coupon='';ui.lastOrder=order;save();navigate('success');
 }
});
document.addEventListener('change',e=>{
 if(e.target.name==='budget-choice'){const input=e.target.closest('form').querySelector('input[name="budget"]');if(e.target.value!=='custom')input.value=e.target.value;else input.focus();}
 if(e.target.id==='sort-select'){ui.filters.sort=e.target.value;render();}
});
document.addEventListener('input',e=>{
 if(e.target.name==='budget'){const form=e.target.closest('form'),custom=form.querySelector('input[value="custom"]');if(custom)custom.checked=true;}
 if(e.target.id==='search-input'){
  const q=e.target.value.trim(),el=document.querySelector('#suggestions');
  const results=q?filterProducts(products,{q}).slice(0,5):[];
  el.innerHTML=results.map(p=>`<button type="button" data-action="search-suggestion" data-query="${esc(p.name)}">${icon('search')} ${p.name}<span class="muted"> · ${money(p.price)}</span></button>`).join('');el.hidden=!results.length;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const s=document.querySelector('#suggestions');if(s)s.hidden=true;}});
window.addEventListener('hashchange',()=>{importSharedKit();rememberProduct();render();const section=new URLSearchParams(location.hash.split('?')[1]).get('section');if(section==='reviews'&&currentRoute().startsWith('product/'))document.querySelector('#reviews')?.scrollIntoView({block:'start'});else window.scrollTo({top:0});main.focus({preventScroll:true});});
window.addEventListener('storage',e=>{if(e.key==='skinmix-v1'){state=loadState();render();}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
importSharedKit();rememberProduct();render();
if(state.alerts.some(a=>Object.values(alertStatus(a,product(a.id))).some(Boolean)))toast('A sample price alert is ready. View your profile for details.');

// Optional browser agent tools use the same catalog and routine actions as the UI.
const modelContext=document.modelContext||navigator.modelContext;
if(modelContext?.registerTool){
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const register=tool=>{try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'search_skinmix_sample_products',description:'Read sample SkinMix products and prices. Does not claim live prices.',inputSchema:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input.query!=='string'||input.query.length>200)throw new Error('A query of at most 200 characters is required.');return filterProducts(products,{q:input.query}).map(p=>({id:p.id,name:p.name,price:p.price,category:p.category,sample:true}));}});
 register({name:'stage_skinmix_sample_routine',description:'Replace the current device-local kit with a sample routine matching skin type, concerns and budget. Does not purchase anything.',inputSchema:{type:'object',properties:{skin:{type:'string',enum:SKIN_TYPES},concerns:{type:'array',items:{type:'string',enum:CONCERNS}},budget:{type:'number',minimum:100,maximum:100000}},required:['skin','concerns','budget'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||!SKIN_TYPES.includes(input.skin)||!Array.isArray(input.concerns)||!input.concerns.every(c=>CONCERNS.includes(c))||!Number.isFinite(input.budget)||input.budget<100||input.budget>100000)throw new Error('Invalid skin profile or budget.');const r=makeRoutine(input);return {ids:r.products.map(p=>p.id),total:totals(r.products).total,incomplete:r.incomplete,sample:true};}});
}

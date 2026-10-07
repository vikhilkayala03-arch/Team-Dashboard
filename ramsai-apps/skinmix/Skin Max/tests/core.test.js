import test from 'node:test';
import assert from 'node:assert/strict';
import { totals, recommendRoutine, filterProducts, alternatives, routineSections, cartTotals, sanitizeState, alertStatus } from '../src/core.js';

const catalog = [
  { id:'c1', name:'Gentle Cleanser', brand:'Simple', category:'Cleanser', price:150, mrp:200, size:100, unit:'ml', skin:['oily','sensitive'], concerns:['Acne'], ingredients:['Niacinamide'], rating:4.5, vegan:true, crueltyFree:true, fragranceFree:true },
  { id:'c2', name:'Hydrating Cleanser', brand:'Plum', category:'Cleanser', price:250, mrp:400, size:100, skin:['dry'], concerns:['Dryness'], ingredients:['Ceramides'], rating:4.3 },
  { id:'m1', name:'Oil-free Moisturizer', brand:'Plum', category:'Moisturizer', price:170, mrp:250, skin:['oily','sensitive'], concerns:['Acne'], ingredients:['Niacinamide'], rating:4.4 },
  { id:'s1', name:'SPF 50 Sunscreen', brand:'Deconstruct', category:'Sunscreen', price:180, mrp:300, skin:['oily','sensitive'], concerns:['Dark spots'], ingredients:['UV filters'], rating:4.6 },
  { id:'r1', name:'Niacinamide Serum', brand:'Minimalist', category:'Serum', price:300, mrp:450, skin:['oily'], concerns:['Acne'], ingredients:['Niacinamide'], rating:4.6 },
  { id:'c3', name:'Premium Cleanser', brand:'Minimalist', category:'Cleanser', price:450, mrp:600, skin:['oily'], concerns:['Acne'], ingredients:['Niacinamide'], rating:4.7 },
];

test('totals show actual MRP savings separately from budget remaining', () => {
  assert.deepEqual(totals([catalog[0],catalog[2]]), { original:450, total:320, savings:130, percent:29 });
  assert.deepEqual(totals([]), { original:0, total:0, savings:0, percent:0 });
});
test('recommended essentials fit an exact 500 budget across multiple brands', () => {
  const r=recommendRoutine(catalog,{skin:'oily',concerns:['Acne'],budget:500});
  assert.deepEqual(r.products.map(p=>p.id),['c1','m1','s1']);
  assert.equal(r.remaining,0); assert.equal(r.incomplete,false);
  assert.equal(Object.keys(r.reasons).length,3);
});
test('insufficient budget reports missing essentials without spending over budget', () => {
  const r=recommendRoutine(catalog,{skin:'oily',concerns:['Acne'],budget:300});
  assert.ok(totals(r.products).total<=300); assert.equal(r.incomplete,true); assert.equal(r.minimum,500);
});
test('invalid recommendation budgets are rejected', () => {
  for(const budget of [-1,0,NaN,Infinity]) assert.throws(()=>recommendRoutine(catalog,{skin:'oily',concerns:[],budget}));
});
test('cheaper alternatives preserve purpose and skin compatibility', () => {
  assert.deepEqual(alternatives(catalog[5],catalog,'oily').map(p=>p.id),['c1']);
});
test('natural language search understands sunscreen under 500', () => {
  assert.deepEqual(filterProducts(catalog,{q:'Best sunscreen under ₹500'}).map(p=>p.id),['s1']);
});
test('natural language oily skin and moisturizer terms identify the right product', () => {
  assert.deepEqual(filterProducts(catalog,{q:'Moisturizer for oily skin'}).map(p=>p.id),['m1']);
});
test('filters intersect brand, ingredients, concern, rating and ethical flags', () => {
  assert.deepEqual(filterProducts(catalog,{brand:'Simple',skin:'oily',concern:'Acne',ingredient:'Niacinamide',rating:4.5,discount:20,vegan:true,fragranceFree:true,crueltyFree:true}).map(p=>p.id),['c1']);
  assert.equal(filterProducts(catalog,{max:100}).length,0);
});
test('routine order is correct and sunscreen never appears at night', () => {
  const r=routineSections([catalog[3],catalog[2],catalog[4],catalog[0]]);
  assert.deepEqual(r.morning.map(p=>p.id),['c1','r1','m1','s1']);
  assert.deepEqual(r.night.map(p=>p.id),['c1','r1','m1']);
});
test('cart handles quantities, coupon, delivery and exact savings', () => {
  assert.deepEqual(cartTotals([{id:'c1',qty:2},{id:'m1',qty:1}],catalog,'SKIN10'),{original:650,subtotal:470,productSavings:180,couponDiscount:47,delivery:49,total:472,savings:227,quantity:3});
});
test('unknown coupon cannot create a discount and 499 subtotal unlocks free delivery', () => {
  const r=cartTotals([{id:'c1',qty:2},{id:'s1',qty:2}],catalog,'WRONG');
  assert.equal(r.couponDiscount,0); assert.equal(r.delivery,0); assert.equal(r.total,660);
});
test('empty cart has no shipping charge', () => {
  assert.equal(cartTotals([],catalog,'').total,0);
});
test('malformed persisted IDs, quantities, preferences and profile recover safely', () => {
  const s=sanitizeState({kit:['missing','c1','c1'],wishlist:['c1','missing'],cart:[{id:'c1',qty:-2},{id:'r1',qty:3},{id:'missing',qty:1}],profile:{skin:'alien',budget:-50,concerns:'bad'},savedKits:'bad',orders:'bad',alerts:'bad'},catalog);
  assert.deepEqual(s.kit,['c1']); assert.deepEqual(s.wishlist,['c1']);
  assert.deepEqual(s.cart,[{id:'r1',qty:3}]); assert.equal(s.profile.skin,'combination'); assert.equal(s.profile.budget,1500);
  assert.deepEqual(s.savedKits,[]); assert.deepEqual(s.orders,[]); assert.deepEqual(s.alerts,[]);
});
test('a zero maximum budget yields no products while blank means no cap',()=>{
 assert.equal(filterProducts(catalog,{max:'0'}).length,0);
 assert.equal(filterProducts(catalog,{max:''}).length,6);
});
test('local alerts recognize target prices, price drops and bigger discounts',()=>{
 assert.deepEqual(alertStatus({target:140,lastPrice:180,lastDiscount:20},catalog[0]),{targetReached:false,priceDropped:true,discountIncreased:true});
 assert.deepEqual(alertStatus({target:160,lastPrice:150,lastDiscount:25},catalog[0]),{targetReached:true,priceDropped:false,discountIncreased:false});
});

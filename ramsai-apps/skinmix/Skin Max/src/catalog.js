const all=['oily','dry','combination','normal','sensitive'];
const oily=['oily','combination','normal'];
const dry=['dry','normal','sensitive','combination'];
const rows=[
 ['simple-cleanser','Simple','Refreshing Facial Wash','Cleanser',249,399,150,'ml',all,['Dryness','Dullness'],['Pro-vitamin B5','Vitamin E'],4.6,0,true,true,true],
 ['plum-cleanser','Plum','Green Tea Gentle Cleanser','Cleanser',129,199,50,'ml',oily,['Acne','Oiliness'],['Green tea','Glycerin'],4.4,5,true,true,false],
 ['minimalist-cleanser','Minimalist','Salicylic Acid 2% Cleanser','Cleanser',299,399,100,'ml',oily,['Acne','Oiliness'],['Salicylic acid','Zinc'],4.7,0,true,true,true],
 ['plum-toner','Plum','Rose Water & HA Toner','Toner',199,299,100,'ml',all,['Dryness','Dullness'],['Rose water','Hyaluronic acid'],4.4,4,true,true,false],
 ['dotkey-toner','Dot & Key','Cica Calming Toner','Toner',349,495,150,'ml',all,['Acne','Oiliness'],['Cica','Green tea'],4.5,4,true,true,true],
 ['foxtale-toner','Foxtale','Hydrating Milky Toner','Toner',279,399,100,'ml',dry,['Dryness','Uneven skin tone'],['Ceramides','Panthenol'],4.6,4,true,true,true],
 ['minimalist-serum','Minimalist','Niacinamide 5% Face Serum','Serum',449,599,30,'ml',all,['Acne','Oiliness','Dark spots'],['Niacinamide','Hyaluronic acid'],4.7,1,true,true,true],
 ['derma-serum','The Derma Co','10% Vitamin C Face Serum','Serum',499,799,30,'ml',oily,['Dullness','Pigmentation','Dark spots'],['Vitamin C','Niacinamide'],4.6,1,true,true,true],
 ['deconstruct-serum','Deconstruct','Hydrating HA Face Serum','Serum',249,399,30,'ml',all,['Dryness','Fine lines','Dullness'],['Hyaluronic acid','Panthenol'],4.5,6,true,true,true],
 ['dotkey-moisturizer','Dot & Key','72H Hydrating Gel Moisturizer','Moisturizer',349,495,50,'g',all,['Dryness','Dullness','Fine lines'],['Hyaluronic acid','Probiotics'],4.8,2,true,true,false],
 ['plum-moisturizer','Plum','Green Tea Oil-Free Moisturizer','Moisturizer',169,299,35,'g',oily,['Oiliness','Acne'],['Green tea','Niacinamide'],4.5,2,true,true,true],
 ['simple-moisturizer','Simple','Hydrating Light Moisturizer','Moisturizer',299,450,125,'ml',all,['Dryness','Fine lines'],['Pro-vitamin B5','Glycerin'],4.6,7,true,true,true],
 ['derma-sunscreen','The Derma Co','1% Hyaluronic Sunscreen SPF 50','Sunscreen',399,499,50,'g',all,['Dark spots','Pigmentation','Uneven skin tone'],['Hyaluronic acid','UV filters'],4.7,3,true,true,true],
 ['deconstruct-sunscreen','Deconstruct','Lightweight Gel Sunscreen SPF 50','Sunscreen',199,349,30,'g',all,['Oiliness','Dark spots','Uneven skin tone'],['UV filters','Glycerin'],4.5,3,true,true,true],
 ['reequil-sunscreen','Re’equil','Ultra Matte Sunscreen SPF 50','Sunscreen',549,695,50,'g',oily,['Oiliness','Dark spots'],['UV filters','Silica'],4.8,3,false,true,false],
 ['plum-mask','Plum','Green Tea Clear Face Mask','Face Mask',249,399,60,'g',oily,['Acne','Oiliness'],['Kaolin','Green tea'],4.4,2,true,true,false],
 ['dotkey-mask','Dot & Key','Cica Calming Clay Mask','Face Mask',349,495,75,'g',oily,['Acne','Oiliness'],['Cica','Kaolin'],4.5,7,true,true,true],
 ['foxtale-mask','Foxtale','Hydrating Sleep Mask','Face Mask',299,499,50,'g',dry,['Dryness','Dullness'],['Ceramides','Squalane'],4.6,7,true,true,true],
 ['minimalist-eye','Minimalist','Caffeine Under Eye Cream','Eye Care',399,599,15,'g',all,['Fine lines','Dullness'],['Caffeine','Peptides'],4.4,7,true,true,true],
 ['plum-eye','Plum','Brightening Under Eye Gel','Eye Care',249,399,15,'g',all,['Dullness','Fine lines'],['Caffeine','Hyaluronic acid'],4.3,2,true,true,false],
 ['dotkey-eye','Dot & Key','Hydrating Eye Repair Cream','Eye Care',349,499,20,'g',dry,['Dryness','Fine lines'],['Ceramides','Peptides'],4.5,7,true,true,true],
 ['plum-lip','Plum','Nourishing Lip Balm','Lip Care',99,199,10,'g',all,['Dryness'],['Shea butter','Vitamin E'],4.5,8,true,true,false],
 ['minimalist-lip','Minimalist','SPF 30 Lip Balm','Lip Care',199,299,8,'g',all,['Dryness','Pigmentation'],['UV filters','Shea butter'],4.6,8,true,true,true],
 ['dotkey-lip','Dot & Key','Ceramide Lip Treatment','Lip Care',149,249,12,'g',all,['Dryness','Dullness'],['Ceramides','Shea butter'],4.5,8,true,true,false],
];
const usage={Cleanser:'Massage a small amount onto damp skin, then rinse. Use morning and night.',Toner:'After cleansing, pat a little onto your skin. Avoid the eye area.',Serum:'After cleansing, apply 2–3 drops. Introduce one new product at a time and follow the product label.',Moisturizer:'Apply a small amount after cleansing and treatment. Use morning and night.',Sunscreen:'Apply generously as the last morning step. Reapply according to the product label, especially outdoors.', 'Face Mask':'Use according to the product label, usually 1–2 times a week. Rinse clay masks; follow sleep mask instructions.', 'Eye Care':'Gently pat a small amount around the orbital bone, avoiding direct contact with eyes.', 'Lip Care':'Apply to lips as needed and follow the product label.'};
export const products=rows.map(([id,brand,name,category,price,mrp,size,unit,skin,concerns,ingredients,rating,art,vegan,crueltyFree,fragranceFree],index)=>({
 id,brand,name,category,price,mrp,size,unit,skin,concerns,ingredients,rating,art,vegan,crueltyFree,fragranceFree,
 reviews:128+index*31,tag:index%5===0?'Bestseller':index%5===1?'Budget pick':index%5===2?'Skin favourite':'',
 benefits:category==='Sunscreen'?['Daily sun protection','Lightweight feel','Easy routine essential']:['Designed for '+skin.slice(0,2).join(' & ')+' skin','A simple '+category.toLowerCase()+' step','Selected for '+concerns.slice(0,2).join(' & ').toLowerCase()],
 use:usage[category], sellers:[{name:'SkinMix',price},{name:'Beauty Basket',price:Math.min(mrp,price+45)},{name:'Care Corner',price:Math.min(mrp,price+80)}],
 description:'A sample '+category.toLowerCase()+' choice for your everyday routine. Compare the demo offers and mix it with products from other brands.'
}));
export const brands=[...new Set(products.map(p=>p.brand))];
export const ingredients=[...new Set(products.flatMap(p=>p.ingredients))].sort();

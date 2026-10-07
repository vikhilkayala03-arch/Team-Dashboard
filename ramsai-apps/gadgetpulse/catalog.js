/* Original GadgetPulse sample catalog. Every product fact is illustrative demo data. */
(function(root){
'use strict';
const CATEGORIES=['Phones','Laptops','Tablets','Smartwatches','Audio','Gaming','Cameras','Smart Home','Accessories','Monitors'];
const BRANDS=['Apple','Samsung','Google','OnePlus','Xiaomi','Motorola','Sony','ASUS','Lenovo','HP','Dell','NVIDIA','AMD','Qualcomm','MediaTek','Nothing','Anker','Microsoft'];
const PRIORITIES=['Performance','Camera','Battery','Gaming','Display','AI','Productivity','Portability','Audio'];
const UPDATED='2026-10-06T09:00:00Z';
const seeds=[
 ['Galaxy S24 Ultra','Samsung','Phones',109999,129999,'#b4a39a','phone',['flagship','camera','AI']],
 ['MacBook Air M3','Apple','Laptops',89990,114900,'#95a7b9','laptop',['student','coding','work','AI']],
 ['Nothing Phone (2a)','Nothing','Phones',23999,25999,'#ece9e1','phone',['mid-range','gaming','value']],
 ['Sony WH-1000XM5','Sony','Audio',24990,34990,'#b1aaa2','headphones',['headphones','ANC','travel']],
 ['Pixel 8a','Google','Phones',29999,52999,'#8fa7c3','phone',['camera','AI','mid-range']],
 ['OnePlus Nord CE4','OnePlus','Phones',21999,24999,'#9cc5b4','phone',['battery','gaming','mid-range']],
 ['Moto G Power','Motorola','Phones',12999,16999,'#9692ce','phone',['budget','battery']],
 ['ROG Strix G16','ASUS','Laptops',94990,119990,'#87918f','laptop',['gaming','creator']],
 ['IdeaPad Slim 3','Lenovo','Laptops',45990,58990,'#b7bdca','laptop',['student','coding','work']],
 ['Pavilion Plus','HP','Laptops',64990,79990,'#c0ad9d','laptop',['business','AI','coding']],
 ['iPad Air','Apple','Tablets',54900,59900,'#aeb4d6','tablet',['student','drawing','productivity']],
 ['Galaxy Tab A9+','Samsung','Tablets',17999,22999,'#adb6c4','tablet',['student','gaming']],
 ['Watch Series 9','Apple','Smartwatches',32900,41900,'#d3b4ac','watch',['fitness','travel']],
 ['Galaxy Watch6','Samsung','Smartwatches',19999,29999,'#8cc4a0','watch',['fitness','battery']],
 ['Buds Pro 2','OnePlus','Audio',3999,9999,'#bbcab4','earbuds',['TWS','ANC','audio']],
 ['Soundcore Mini','Anker','Audio',2999,4999,'#b09cc4','speaker',['speaker','audio']],
 ['PlayStation 5 Slim','Sony','Gaming',44990,54990,'#f0e9df','console',['console','gaming']],
 ['Xbox Controller','Microsoft','Gaming',4999,5999,'#b5c7be','controller',['controller','gaming']],
 ['Alpha a6400','Sony','Cameras',72990,84990,'#99989c','camera',['photography','content creation']],
 ['Smart Hub Mini','Google','Smart Home',4999,6999,'#c9bdbc','speaker',['smart home','assistant']],
 ['65W USB-C Charger','Anker','Accessories',2499,3499,'#9fa8b6','charger',['charger','USB-C','laptop','phone']],
 ['Power Bank 20000','Xiaomi','Accessories',1999,2999,'#bdb6ad','charger',['power bank','USB-C','battery']],
 ['Creator View 27','Dell','Monitors',22999,29999,'#8aa8bd','monitor',['display','coding','work']],
 ['Mechanical Keyboard','Lenovo','Accessories',3499,4999,'#b0a0c7','keyboard',['keyboard','gaming','laptop']],
 ['Smart View 43 TV','Sony','Smart Home',32990,44990,'#929bad','monitor',['TV','display','smart home']],
 ['USB-C Dock','Anker','Accessories',3999,5499,'#aba5bb','charger',['dock','adapter','laptop','USB-C']],
 ['Precision Mouse','Lenovo','Accessories',1499,1999,'#b1acbb','mouse',['mouse','laptop','gaming']],
 ['USB-C Cable','Anker','Accessories',699,999,'#b1a8c8','charger',['cable','USB-C','phone','laptop']]
];
const phoneSpecs={'Processor':'8-core mobile processor','RAM':'8 GB','Storage':'256 GB','Display':'6.7-inch AMOLED','Refresh rate':'120 Hz','Battery':'5,000 mAh','Charging':'67 W USB-C','Main camera':'50 MP','Ultra-wide camera':'12 MP','Telephoto camera':'Not included','Front camera':'16 MP','Operating system':'Android','5G':'Yes','Wi-Fi':'Wi-Fi 6','Bluetooth':'5.3','NFC':'Yes','IP rating':'IP54','Weight':'190 g','Dimensions':'161 × 75 × 8 mm'};
const laptopSpecs={'Processor':'8-core laptop processor','GPU':'Integrated graphics','RAM':'16 GB','Storage':'512 GB SSD','Display':'14-inch IPS','Refresh rate':'60 Hz','Battery':'60 Wh','Ports':'USB-C, USB-A, audio','Weight':'1.4 kg','Operating system':'Windows 11'};
const tabletSpecs={'Processor':'8-core tablet processor','Display':'11-inch IPS','Refresh rate':'90 Hz','RAM':'8 GB','Storage':'128 GB','Battery':'8,000 mAh','Cameras':'13 MP / 8 MP','Stylus support':'Optional, sold separately','Keyboard support':'Bluetooth / compatible dock','Connectivity':'Wi-Fi 6, Bluetooth 5.3'};
const otherSpecs={Audio:{'Connectivity':'Bluetooth 5.3','Battery':'Up to 30 hours','Charging':'USB-C','Noise cancellation':'Active / demo','Weight':'250 g'},Smartwatches:{'Display':'1.4-inch OLED','Battery':'Up to 40 hours','Sensors':'Heart rate, motion','Connectivity':'Bluetooth, Wi-Fi','Water resistance':'5 ATM'},Gaming:{'Processor':'Gaming chipset','Storage':'1 TB','Display output':'Up to 4K','Connectivity':'Wi-Fi, Bluetooth','Ports':'HDMI, USB-C'},Cameras:{'Sensor':'24 MP APS-C','Video':'4K / 30 fps','Lens mount':'Interchangeable','Connectivity':'Wi-Fi, USB','Weight':'403 g'},'Smart Home':{'Connectivity':'Wi-Fi, Bluetooth','Compatibility':'Android / iOS','Power':'Mains adapter','Controls':'Voice and app'},Accessories:{'Connectivity':'USB-C','Compatibility':'USB-C PD devices','Warranty':'1 year demo','Weight':'180 g'},Monitors:{'Display':'27-inch IPS','Resolution':'2560 × 1440','Refresh rate':'144 Hz','Ports':'HDMI, DisplayPort','Mount':'VESA 100 × 100'}};
const products=seeds.map(([name,brand,category,price,mrp,color,art,tags],i)=>{
 const scores=Object.fromEntries(PRIORITIES.map((p,j)=>[p,+(7+(i*7+j*3)%25/10).toFixed(1)]));
 if(tags.includes('camera'))scores.Camera=9.3;
 if(tags.includes('gaming'))scores.Gaming=9.2;
 if(tags.includes('coding'))scores.Productivity=9.1;
 const score=+(Object.values(scores).reduce((a,b)=>a+b,0)/PRIORITIES.length).toFixed(1);
 return {id:`g${i+1}`,name,brand,category,price,mrp,color,art,tags,score,rating:+(4.3+i%5/10).toFixed(1),scores,specs:{...(category==='Phones'?phoneSpecs:category==='Laptops'?laptopSpecs:category==='Tablets'?tabletSpecs:otherSpecs[category])},pros:['Thoughtful design and finish',`Strong ${tags[0]} features`,'Good value at the sample price'],cons:['Specs are illustrative demo values','Confirm included accessories with brand'],history:[mrp,Math.round(mrp*.95),Math.round(mrp*.88),Math.round(mrp*.89),Math.round(price*1.04),Math.round(price*.96),price],launch:`2026-0${i%3+7}-15`,status:i<4?'Trending':i%3===0?'New':'Popular',stock:i%7===0?'Limited stock (demo)':'Available (demo)',priceRecord:{price,currency:'INR',seller:`${brand} sample offer`,location:'India',timestamp:UPDATED,source:'GadgetPulse demo catalog; not manufacturer pricing',demo:true}};
});
const officialStores={Apple:'https://www.apple.com/in/',Samsung:'https://www.samsung.com/in/',Google:'https://store.google.com/',OnePlus:'https://www.oneplus.in/',Nothing:'https://nothing.tech/',Sony:'https://www.sony.co.in/',ASUS:'https://www.asus.com/in/',Lenovo:'https://www.lenovo.com/in/en/',HP:'https://www.hp.com/in-en/',Motorola:'https://www.motorola.in/',Microsoft:'https://www.microsoft.com/',Anker:'https://www.anker.com/',Xiaomi:'https://www.mi.com/in/',Dell:'https://www.dell.com/en-in/'};
const news=[
 {id:'n1',title:'The next wave of AI is coming to your pocket.',category:'AI & innovation',brand:'Samsung',art:'phone',color:'#9491d0',summary:'An editorial demo exploring on-device intelligence, smaller models, and what they could mean for everyday phones.',read:4,date:'6 Oct 2026',body:'This is a fictional editorial sample, not a report of a real announcement. On-device AI can reduce round trips to remote servers for tasks such as text suggestions and image organization. Buyers should check which features run locally, which require connectivity, and how long the manufacturer supports them.'},
 {id:'n2',title:'Small laptop. Serious possibilities.',category:'Computing',brand:'Apple',art:'laptop',color:'#9fa9c5',summary:'What to look for in a lightweight laptop for your next semester.',read:3,date:'5 Oct 2026',body:'Demo buying guide. Start with the software required by your course, then compare memory, battery, keyboard comfort, ports, and weight. A more expensive processor does not automatically improve note taking. Check official specifications before purchase.'},
 {id:'n3',title:'Less noise. More of what you love.',category:'Audio',brand:'Sony',art:'headphones',color:'#bca29c',summary:'A simple guide to noise cancellation, comfort, and finding your sound.',read:2,date:'4 Oct 2026',body:'Demo buying guide. Active noise cancellation works best against steady background sounds. Fit and passive isolation matter too. Compare comfort, call quality, battery, multipoint support, and the return policy before choosing.'},
 {id:'n4',title:'Beyond the specs: a smarter display.',category:'Display technology',brand:'Dell',art:'monitor',color:'#83b8b4',summary:'Refresh rates, resolution and color accuracy, explained.',read:5,date:'3 Oct 2026',body:'Demo educational article. Resolution determines workspace and sharpness; refresh rate influences smoothness. Color accuracy and panel quality matter for creative work. Choose a screen around your actual use and confirm supported ports.'}
];
const upcoming=[{name:'Next-generation foldable',brand:'Samsung',status:'Rumored / Expected',date:'Q1 2027 (demo)',price:'₹90,000–₹1,30,000 (demo)',features:'Possible lighter hinge and on-device AI; unconfirmed',art:'phone',color:'#a69abd'},{name:'Future creator laptop',brand:'ASUS',status:'Rumored / Expected',date:'Late 2026 (demo)',price:'₹75,000–₹1,00,000 (demo)',features:'Possible AI processor and OLED panel; unconfirmed',art:'laptop',color:'#8fb5bd'}];
const cities={Chennai:{state:'Tamil Nadu',pin:'600001'},Bengaluru:{state:'Karnataka',pin:'560001'},Mumbai:{state:'Maharashtra',pin:'400001'},Delhi:{state:'Delhi',pin:'110001'},Hyderabad:{state:'Telangana',pin:'500001'}};
const defaultState={wishlist:[],comparisons:[],alerts:[],recent:[],searches:[],reviews:[],preferences:{categories:[],brands:[],budget:100000,priority:'Performance',useCases:[],notifications:true},overrides:{},newsOverrides:{}};

const data={CATEGORIES,BRANDS,PRIORITIES,UPDATED,products,officialStores,news,upcoming,cities,defaultState};
if(typeof module==='object'&&module.exports)module.exports=data;else root.GadgetPulseData=data;
})(typeof window==='undefined'?globalThis:window);

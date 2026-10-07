/* GreenRoots data. Prices, yields and costs are ILLUSTRATIVE estimates per acre – edit them for your region. */
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// water: 1 low, 2 medium, 3 high.  sow/harvest are month numbers (1-12).
const CROPS=[
 {id:"rice",name:"Rice (paddy)",e:"🌾",seasons:["kharif"],soils:["alluvial","black"],water:3,sow:[6,7],harvest:[10,11],days:120,yield:22,price:2300,cost:25000,tip:"Keep 2–5 cm water standing in the field during growth."},
 {id:"wheat",name:"Wheat",e:"🌾",seasons:["rabi"],soils:["alluvial","loamy","black"],water:2,sow:[11,12],harvest:[3,4],days:130,yield:18,price:2275,cost:18000,tip:"Sow on time. Late sowing cuts yield."},
 {id:"maize",name:"Maize",e:"🌽",seasons:["kharif","rabi"],soils:["loamy","alluvial","red"],water:2,sow:[6,7],harvest:[9,10],days:100,yield:25,price:2090,cost:20000,tip:"Needs well-drained soil. Waterlogging harms roots."},
 {id:"cotton",name:"Cotton",e:"☁️",seasons:["kharif"],soils:["black","alluvial"],water:2,sow:[5,6],harvest:[11,12],days:170,yield:8,price:7000,cost:35000,tip:"Scout weekly for bollworm and sucking pests."},
 {id:"sugarcane",name:"Sugarcane",e:"🎋",seasons:["zaid","kharif"],soils:["alluvial","loamy","black"],water:3,sow:[2,3],harvest:[12,1,2],days:330,yield:350,price:350,cost:55000,tip:"A long crop. Mulch the trash to save water."},
 {id:"soybean",name:"Soybean",e:"🫘",seasons:["kharif"],soils:["black","loamy"],water:2,sow:[6,7],harvest:[10],days:100,yield:8,price:4600,cost:17000,tip:"Fixes nitrogen, so it helps the next crop."},
 {id:"groundnut",name:"Groundnut",e:"🥜",seasons:["kharif","zaid"],soils:["sandy","red","loamy"],water:1,sow:[6,7],harvest:[10,11],days:110,yield:10,price:6300,cost:25000,tip:"Loose, sandy soil lets pegs enter the ground."},
 {id:"mustard",name:"Mustard",e:"🌼",seasons:["rabi"],soils:["loamy","alluvial","sandy"],water:1,sow:[10,11],harvest:[2,3],days:120,yield:7,price:5650,cost:14000,tip:"Very water-efficient. A good choice for dry rabi fields."},
 {id:"chickpea",name:"Chickpea (chana)",e:"🟤",seasons:["rabi"],soils:["black","loamy","sandy"],water:1,sow:[10,11],harvest:[2,3],days:110,yield:8,price:5440,cost:15000,tip:"Avoid heavy irrigation. Pinch tips at 30 days for more branching."},
 {id:"tomato",name:"Tomato",e:"🍅",seasons:["kharif","rabi"],soils:["loamy","red","sandy"],water:2,sow:[7,10],harvest:[11,2],days:110,yield:100,price:1500,cost:60000,tip:"Stake the plants. Prices swing widely, so watch the mandi."},
 {id:"onion",name:"Onion",e:"🧅",seasons:["rabi","kharif"],soils:["loamy","alluvial","black"],water:2,sow:[10,11],harvest:[3,4],days:140,yield:90,price:1500,cost:50000,tip:"Cure bulbs in shade for 7–10 days before storing."},
 {id:"potato",name:"Potato",e:"🥔",seasons:["rabi"],soils:["sandy","loamy","alluvial"],water:2,sow:[10,11],harvest:[1,2],days:90,yield:100,price:1200,cost:55000,tip:"Earth up the rows so tubers don't turn green."},
 {id:"bajra",name:"Pearl millet (bajra)",e:"🌾",seasons:["kharif"],soils:["sandy","red"],water:1,sow:[6,7],harvest:[9,10],days:85,yield:8,price:2600,cost:10000,tip:"Thrives in hot, dry places where other cereals struggle."},
 {id:"moong",name:"Green gram (moong)",e:"🫛",seasons:["zaid","kharif"],soils:["loamy","sandy","red"],water:1,sow:[3,4],harvest:[6],days:65,yield:4,price:8000,cost:10000,tip:"A short crop that fits between wheat and paddy."},
 {id:"watermelon",name:"Watermelon",e:"🍉",seasons:["zaid"],soils:["sandy","loamy"],water:2,sow:[2,3],harvest:[5,6],days:90,yield:120,price:1000,cost:40000,tip:"Drip irrigation and mulch improve sweetness and save water."}
];
const SYMPTOMS=["Older leaves turn yellow","New leaves yellow with green veins","Stunted, slow growth","White powder on leaves","Brown spots with yellow rings","Curled or twisted leaves","Sticky, shiny leaves","Tiny insects on leaves","Wilting while soil is wet","Wilting while soil is dry","Crispy leaf edges","Soft, black roots","Yellow mosaic pattern","Holes in leaves","Insect droppings on leaves","Foul smell from soil"];
const PROBLEMS=[
 {n:"Nitrogen deficiency",e:"🟡",sym:["Older leaves turn yellow","Stunted, slow growth"],fix:["Add well-rotted compost or vermicompost.","Apply a nitrogen source (urea or green manure) in the amount your soil test advises.","Grow legumes in rotation."]},
 {n:"Iron deficiency",e:"🍃",sym:["New leaves yellow with green veins","Stunted, slow growth"],fix:["Check soil pH. High pH locks up iron.","Spray chelated iron or ferrous sulphate solution as per label.","Add organic matter."]},
 {n:"Powdery mildew",e:"🌫️",sym:["White powder on leaves","Curled or twisted leaves"],fix:["Spray neem oil or a sulphur-based fungicide as per label.","Improve spacing and airflow.","Remove badly infected leaves."]},
 {n:"Leaf spot / blight (fungal)",e:"🟤",sym:["Brown spots with yellow rings","Crispy leaf edges"],fix:["Remove and destroy infected leaves.","Avoid watering from above; irrigate in the morning.","Use a copper-based fungicide as per label and rotate crops."]},
 {n:"Aphids",e:"🐜",sym:["Sticky, shiny leaves","Tiny insects on leaves","Curled or twisted leaves"],fix:["Spray a strong jet of water or neem oil.","Use soap-water spray (mild).","Encourage ladybirds; control ants that protect aphids."]},
 {n:"Whitefly / yellow mosaic virus",e:"🦟",sym:["Yellow mosaic pattern","Tiny insects on leaves","Curled or twisted leaves"],fix:["Use yellow sticky traps.","Remove and destroy infected plants early.","Spray neem oil; ask your agri officer about resistant varieties."]},
 {n:"Caterpillar / leaf-eating pests",e:"🐛",sym:["Holes in leaves","Insect droppings on leaves"],fix:["Hand-pick caterpillars in the early morning.","Spray neem seed kernel extract or Bt as per label.","Install pheromone traps to monitor."]},
 {n:"Root rot / overwatering",e:"💧",sym:["Wilting while soil is wet","Soft, black roots","Foul smell from soil","Older leaves turn yellow"],fix:["Stop watering and improve drainage.","Raise beds or add channels.","Apply Trichoderma to the soil and avoid waterlogging."]},
 {n:"Water stress",e:"☀️",sym:["Wilting while soil is dry","Crispy leaf edges","Curled or twisted leaves"],fix:["Irrigate deeply, early morning or evening.","Mulch to hold moisture.","Consider drip irrigation."]}
];
const CITIES={"Delhi":[28.61,77.21],"Mumbai":[19.08,72.88],"Pune":[18.52,73.86],"Hyderabad":[17.38,78.49],"Chennai":[13.08,80.27],"Kolkata":[22.57,88.36],"Lucknow":[26.85,80.95],"Ludhiana":[30.90,75.86],"Nagpur":[21.15,79.09],"Bengaluru":[12.97,77.59]};

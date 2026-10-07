/* Shared content. Edit here to add countries, dishes, lessons. */
const AI_ENDPOINT = ""; // optional: URL of your own AI backend (see README). Empty = built-in offline AI.
const COUNTRIES = [
 {id:"jp",name:"Japan",region:"ASIA",emoji:"🍣",bg:"var(--rose)",desc:"Sushi, ramen, tea culture and Japanese dining etiquette.",phrase:"Itadakimasu (いただきます) – said before eating"},
 {id:"it",name:"Italy",region:"EUROPE",emoji:"🍝",bg:"var(--mint)",desc:"Pasta, pizza, regional traditions and Italian food culture.",phrase:"Buon appetito – enjoy your meal"},
 {id:"in",name:"India",region:"ASIA",emoji:"🍛",bg:"#FDF5E3",desc:"Spices, regional cuisines, thalis and cooking traditions.",phrase:"Namaste – a respectful greeting"},
 {id:"th",name:"Thailand",region:"ASIA",emoji:"🍜",bg:"var(--lav)",desc:"Street food, herbs, curries and bold local flavours.",phrase:"Aroi mak – very delicious"},
 {id:"mx",name:"Mexico",region:"AMERICAS",emoji:"🌮",bg:"#FFF1DC",desc:"Corn, chillies, tacos and centuries-old market food.",phrase:"¡Provecho! – enjoy your meal"},
 {id:"fr",name:"France",region:"EUROPE",emoji:"🥐",bg:"#EEF3FB",desc:"Bread, cheese, sauces and the art of the long meal.",phrase:"Bon appétit – enjoy your meal"}
];
/* Dish knowledge base used by the AI Menu Scanner and Chef Vicky chat */
const DISHES = [
 {k:["sushi","nigiri"],name:"Sushi",c:"Japan",e:"🍣",mean:"Vinegared rice topped or rolled with fish or vegetables.",ing:["rice","rice vinegar","raw fish","nori"],al:["fish","soy"],story:"Began as a way to preserve fish in fermented rice, centuries before the modern version."},
 {k:["ramen","tonkotsu"],name:"Ramen",c:"Japan",e:"🍜",mean:"Wheat noodles in a rich broth. Tonkotsu means pork-bone broth.",ing:["wheat noodles","pork bones","soy tare","egg"],al:["gluten","egg","soy","pork"],story:"Adapted from Chinese noodle soups and became a Japanese comfort food after WWII."},
 {k:["tempura"],name:"Tempura",c:"Japan",e:"🍤",mean:"Seafood and vegetables dipped in light batter and deep fried.",ing:["shrimp","vegetables","flour","egg"],al:["gluten","egg","shellfish"],story:"Introduced by Portuguese traders in the 1500s."},
 {k:["miso"],name:"Miso soup",c:"Japan",e:"🥣",mean:"Soup of dashi stock and fermented soybean paste.",ing:["miso","dashi","tofu","seaweed"],al:["soy","fish"],story:"Fermented soy has been a Japanese staple for over 1,000 years."},
 {k:["carbonara"],name:"Spaghetti carbonara",c:"Italy",e:"🍝",mean:"Roman pasta with egg, hard cheese, cured pork and black pepper.",ing:["spaghetti","egg","pecorino","guanciale","pepper"],al:["gluten","egg","dairy","pork"],story:"Authentic Roman versions use no cream. The creaminess comes from egg and pasta water."},
 {k:["margherita","pizza"],name:"Pizza Margherita",c:"Italy",e:"🍕",mean:"Neapolitan pizza with tomato, mozzarella and basil.",ing:["dough","tomato","mozzarella","basil"],al:["gluten","dairy"],story:"Its red, white and green colours echo the Italian flag."},
 {k:["risotto"],name:"Risotto",c:"Italy",e:"🍚",mean:"Creamy northern Italian rice cooked slowly in stock.",ing:["arborio rice","stock","butter","parmesan"],al:["dairy"],story:"Rice has grown in the Po Valley since the 15th century."},
 {k:["biryani"],name:"Biryani",c:"India",e:"🍛",mean:"Layered, spiced rice cooked with meat or vegetables.",ing:["basmati rice","spices","saffron","meat or vegetables"],al:["dairy"],story:"Brought to India by Mughal cooks; Hyderabad and Lucknow each have their own style."},
 {k:["dosa"],name:"Dosa",c:"India",e:"🥞",mean:"Thin crisp crepe of fermented rice and lentil batter.",ing:["rice","urad dal","chutney","sambar"],al:["none common"],story:"A South Indian staple eaten for breakfast for many centuries."},
 {k:["paneer","tikka"],name:"Paneer tikka",c:"India",e:"🧀",mean:"Marinated cottage cheese cubes grilled in a tandoor.",ing:["paneer","yogurt","spices","peppers"],al:["dairy"],story:"Tandoor cooking came to Indian menus from Persian and Central Asian traditions."},
 {k:["pad thai"],name:"Pad Thai",c:"Thailand",e:"🍜",mean:"Stir-fried rice noodles with tamarind, egg and peanuts.",ing:["rice noodles","tamarind","egg","peanuts","lime"],al:["peanut","egg","fish sauce"],story:"Promoted as a national dish in the 1930s–40s."},
 {k:["tom yum"],name:"Tom Yum",c:"Thailand",e:"🍲",mean:"Hot and sour soup with lemongrass, galangal and lime.",ing:["lemongrass","galangal","lime leaf","chilli","shrimp"],al:["shellfish","fish sauce"],story:"Thai cooking balances sour, salty, sweet and spicy in one bowl."},
 {k:["taco","al pastor"],name:"Tacos al pastor",c:"Mexico",e:"🌮",mean:"Spit-roasted marinated pork in a corn tortilla with pineapple.",ing:["pork","chilli","pineapple","corn tortilla"],al:["pork"],story:"Inspired by shawarma brought by Lebanese immigrants to Mexico."},
 {k:["croissant"],name:"Croissant",c:"France",e:"🥐",mean:"Flaky pastry made of laminated butter dough.",ing:["flour","butter","yeast"],al:["gluten","dairy"],story:"Descended from the Austrian kipferl and perfected in Paris."},
 {k:["ratatouille"],name:"Ratatouille",c:"France",e:"🍆",mean:"Provençal stewed vegetables.",ing:["aubergine","courgette","tomato","peppers","herbs"],al:["none common"],story:"A humble farmers' dish from Nice."}
];
/* Lessons + quiz */
const LESSONS = [{
 id:"jp-etiquette",title:"Japanese Dining Etiquette",country:"Japan",emoji:"🍣",xp:50,
 steps:[
  {e:"🥢",t:"Chopsticks",d:"Never stick chopsticks upright in rice – it resembles funeral rites. Never pass food chopstick to chopstick. Rest them on the holder when pausing."},
  {e:"🙏",t:"Before and after",d:"Say “itadakimasu” before eating and “gochisosama deshita” when finished to thank everyone involved."},
  {e:"🍜",t:"Slurping",d:"Slurping noodles is polite. It shows enjoyment and cools the hot broth."},
  {e:"💴",t:"No tipping",d:"Tipping is not customary in Japan. Good service is expected and a thank-you is enough."},
  {e:"🍶",t:"Pouring drinks",d:"Pour for others, not yourself. Hold your glass when someone pours for you."}],
 quiz:[
  {q:"Where should you never leave your chopsticks?",o:["Resting on a holder","Standing upright in rice","On the tray edge"],a:1},
  {q:"What do you say before eating?",o:["Itadakimasu","Sayonara","Arigato gozaimasu"],a:0},
  {q:"Is slurping noodles rude in Japan?",o:["Yes, very rude","No, it shows enjoyment","Only at home"],a:1},
  {q:"Should you tip in Japan?",o:["Always 20%","Round up","No, it is not customary"],a:2}]
}];
const ADVENTURES = [
 {id:"mystery",e:"🥕",bg:"var(--mint)",t:"Find the Mystery Ingredient",d:"Visit a local food market, identify a traditional ingredient and unlock its story.",xp:50},
 {id:"phrases",e:"💬",bg:"var(--lav)",t:"Learn 5 phrases before you eat",d:"Practise greetings and thank-yous in the local language.",xp:30},
 {id:"local",e:"🍽️",bg:"var(--peach)",t:"Order like a local",d:"Skip the tourist menu and order a regional speciality using what you learned.",xp:60},
 {id:"cook",e:"👩‍🍳",bg:"#FDF5E3",t:"Cook a regional dish",d:"Pick a recipe from the Recipes page and cook it at home.",xp:80}
];
const RECIPES = [
 {e:"🍝",t:"Spaghetti Carbonara",c:"Italy",time:"25 min",steps:"Fry guanciale. Whisk egg yolks with pecorino and pepper. Toss hot pasta off the heat with pasta water until glossy."},
 {e:"🍜",t:"Quick Miso Ramen",c:"Japan",time:"30 min",steps:"Simmer stock with miso and ginger. Cook noodles separately. Top with soft egg, spring onion and nori."},
 {e:"🍛",t:"Chickpea Masala",c:"India",time:"35 min",steps:"Fry onion, ginger and garlic. Add garam masala and tomatoes. Simmer chickpeas until thick. Finish with coriander."},
 {e:"🌮",t:"Tacos al Pastor",c:"Mexico",time:"40 min",steps:"Marinate pork with chilli, vinegar and achiote. Grill thin, serve on warm tortillas with pineapple, onion and lime."}
];
const SKILLS = [
 {e:"🍳",t:"Cooking Basics",d:"Heat control, preparation, seasoning and timing.",l:"Start lesson"},
 {e:"🔪",t:"Knife Skills",d:"Safe handling and basic cuts used in professional kitchens.",l:"Start lesson"},
 {e:"🌶️",t:"Ingredients & Spices",d:"Herbs, spices, vegetables and proteins that create flavour.",l:"Start lesson"},
 {e:"🍲",t:"Cooking Techniques",d:"Boiling, steaming, grilling, roasting, frying and sautéing.",l:"Start lesson"},
 {e:"🥗",t:"Healthy Cooking",d:"Balanced meals, fresh produce and smart swaps.",l:"Start lesson"},
 {e:"👨‍🍳",t:"Chef Tips",d:"Small habits that make home cooking taste professional.",l:"Start lesson"}
];

/* Detailed lessons that open when a cooking-skill card is clicked. Edit freely. */
const SKILL_DETAIL = {
"Cooking Basics":{intro:"Good cooking starts with a few habits. Master these and every recipe gets easier.",
 sections:[{h:"Core ideas",list:[["🔥","Heat control","Preheat the pan before adding food. Medium heat suits most cooking; high heat is for searing and stir-fries, low for simmering."],["🧺","Mise en place","Chop, measure and gather everything before turning on the heat. It prevents burnt garlic and panic."],["🧂","Seasoning","Season in layers and taste as you go. Salt early draws out flavour; acid (lemon, vinegar) added at the end brightens a dish."],["⏱️","Timing","Start the slowest item first. Let meat rest after cooking so juices stay inside."]]},
 {h:"Pantry staples",list:[["🧅","Aromatics","Onion, garlic and ginger form the flavour base of most cuisines."],["🫒","Fats","Olive oil, neutral oil, butter and ghee each suit different temperatures."],["🍋","Acids","Lemon, lime, vinegar and tamarind balance richness."]]}],
 tips:["Pat food dry before searing so it browns instead of steaming.","Don't overcrowd the pan. Cook in batches.","Clean as you go."]},
"Knife Skills":{intro:"A sharp knife is safer than a dull one because it needs less force and slips less.",
 sections:[{h:"Safe handling",list:[["🤏","Pinch grip","Pinch the blade just above the handle with thumb and forefinger; wrap the other fingers around the handle."],["🐾","Claw grip","Curl the fingertips of your guiding hand inward and let your knuckles guide the blade."],["🧻","Stable board","Place a damp towel under the cutting board so it never slides."]]},
 {h:"Basic cuts",list:[["🥕","Slice","Even, flat cuts for sautéing or salads."],["🧅","Dice","Cubes about 1 cm (medium dice); small dice about 0.5 cm. Square off the vegetable first."],["🥒","Julienne","Thin matchsticks about 3 mm wide, good for stir-fries and garnishes."],["🌿","Chiffonade","Stack leaves, roll them tightly and slice into ribbons (basil, mint)."],["🧄","Mince","Very fine chopping for garlic, ginger or herbs. Rock the blade over the pile."]]}],
 tips:["Hone the knife often and sharpen it a few times a year.","Never catch a falling knife.","Wash and dry knives by hand and store them safely."]},
"Ingredients & Spices":{intro:"Flavour comes from building layers: aromatics, spices, herbs, then acid and salt.",
 sections:[{h:"Essential spices",list:[["🌶️","Chilli","Heat and fruitiness. Fresh, dried or flaked."],["🟡","Turmeric","Earthy and warm, gives curries their golden colour."],["🌰","Cumin","Smoky and warm; used in Indian, Mexican and Middle Eastern cooking."],["🌿","Coriander seed","Citrusy and sweet; pairs with cumin."],["🧡","Paprika","Sweet or smoked pepper powder common in Spanish and Hungarian food."],["⚫","Black pepper","Sharp, pungent heat; best freshly ground."],["🌼","Saffron","Delicate, floral and precious; a few threads colour and flavour rice."],["🍂","Cinnamon & cardamom","Warm sweet spices for both desserts and savoury dishes."]]},
 {h:"Fresh herbs",list:[["🌱","Basil","Italian and Thai cooking. Add at the end."],["🍃","Coriander (cilantro)","Fresh and citrusy; Indian, Thai and Mexican dishes."],["🌿","Parsley, thyme, rosemary","French and Mediterranean staples. Hardy herbs (rosemary, thyme) can cook longer."]]},
 {h:"Building flavour",list:[["🧅","Aromatics first","Fry onion, garlic or ginger gently in oil."],["🌰","Bloom spices","Toast whole spices or fry ground spices in oil for about 30 seconds to wake them up."],["🍋","Finish with acid","A squeeze of lemon or lime lifts the whole dish."]]}],
 tips:["Buy whole spices and grind as needed.","Store spices away from heat and light.","Taste before adding more salt."]},
"Cooking Techniques":{intro:"The same ingredient tastes completely different depending on how you cook it.",
 sections:[{h:"Methods",list:[["♨️","Boiling","Cooking in bubbling water (100°C). Good for pasta, potatoes and eggs. Salt the water."],["🫧","Simmering","Gentle bubbles below a boil. Ideal for soups, stews and sauces."],["🥟","Steaming","Cooking over hot steam. Keeps nutrients and texture in vegetables, fish and dumplings."],["🔥","Grilling","Direct high heat, giving char and smoky flavour. Great for meat, fish and vegetables."],["🍗","Roasting","Dry oven heat that browns the outside and cooks evenly. Use for chicken and root vegetables."],["🍳","Frying","Cooking in hot fat. Shallow frying gives a crisp crust; deep frying needs careful oil temperature."],["🥘","Sautéing","Quick cooking in a little hot fat while tossing, which keeps food tender and lightly browned."],["🍲","Braising","Brown first, then cook slowly in liquid with a lid; makes tough cuts tender."]]}],
 tips:["Browning (the Maillard reaction) is flavour. Don't stir too much.","Use a thermometer for meat: chicken is safe at 75°C (165°F) in the thickest part.","Let hot oil shimmer before adding food, and keep water away from it."]},
"Healthy Cooking":{intro:"Healthy cooking is mostly about balance and technique, not strict rules.",
 sections:[{h:"Build a balanced plate",list:[["🥦","Half vegetables","Aim for variety and colour."],["🍚","A quarter whole grains","Brown rice, millet, oats, whole wheat."],["🍗","A quarter protein","Lentils, beans, eggs, fish, chicken, tofu or paneer."],["🥑","A little healthy fat","Olive oil, nuts, seeds or avocado."]]},
 {h:"Smart swaps",list:[["🫙","Yogurt for cream","Gives creaminess with less fat."],["🍋","Herbs and citrus for salt","Boost flavour with less sodium."],["🥣","Steam or bake instead of deep frying","Cuts oil but keeps flavour."],["🌾","Whole grains for refined","More fibre and steady energy."]]}],
 tips:["Wash fruit and vegetables before preparing.","Keep raw meat away from ready-to-eat food.","Dietary needs vary. Ask a doctor or dietitian for personal advice."]},
"Chef Tips":{intro:"Small habits that separate good home cooking from great.",
 sections:[{h:"Habits of good cooks",list:[["👅","Taste constantly","Adjust salt, acid, sweetness and heat as you go."],["📖","Read the whole recipe first","Know the steps and timing before you start."],["🧊","Cold pan for some things","Start bacon or duck skin in a cold pan so fat renders slowly."],["🍝","Save pasta water","The starchy water makes sauces silky."],["🥩","Rest your meat","5–10 minutes keeps juices in the meat."],["🧈","Finish with butter or oil","A final spoonful adds shine and richness to sauces."]]}],
 tips:["Keep a bowl for scraps so the counter stays clear.","Use a kitchen scale for baking.","Keep practising. Every dish teaches something."]}
};

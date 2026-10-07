(() => {
  // src/catalog.js
  var all = ["oily", "dry", "combination", "normal", "sensitive"];
  var oily = ["oily", "combination", "normal"];
  var dry = ["dry", "normal", "sensitive", "combination"];
  var rows = [
    ["simple-cleanser", "Simple", "Refreshing Facial Wash", "Cleanser", 249, 399, 150, "ml", all, ["Dryness", "Dullness"], ["Pro-vitamin B5", "Vitamin E"], 4.6, 0, true, true, true],
    ["plum-cleanser", "Plum", "Green Tea Gentle Cleanser", "Cleanser", 129, 199, 50, "ml", oily, ["Acne", "Oiliness"], ["Green tea", "Glycerin"], 4.4, 5, true, true, false],
    ["minimalist-cleanser", "Minimalist", "Salicylic Acid 2% Cleanser", "Cleanser", 299, 399, 100, "ml", oily, ["Acne", "Oiliness"], ["Salicylic acid", "Zinc"], 4.7, 0, true, true, true],
    ["plum-toner", "Plum", "Rose Water & HA Toner", "Toner", 199, 299, 100, "ml", all, ["Dryness", "Dullness"], ["Rose water", "Hyaluronic acid"], 4.4, 4, true, true, false],
    ["dotkey-toner", "Dot & Key", "Cica Calming Toner", "Toner", 349, 495, 150, "ml", all, ["Acne", "Oiliness"], ["Cica", "Green tea"], 4.5, 4, true, true, true],
    ["foxtale-toner", "Foxtale", "Hydrating Milky Toner", "Toner", 279, 399, 100, "ml", dry, ["Dryness", "Uneven skin tone"], ["Ceramides", "Panthenol"], 4.6, 4, true, true, true],
    ["minimalist-serum", "Minimalist", "Niacinamide 5% Face Serum", "Serum", 449, 599, 30, "ml", all, ["Acne", "Oiliness", "Dark spots"], ["Niacinamide", "Hyaluronic acid"], 4.7, 1, true, true, true],
    ["derma-serum", "The Derma Co", "10% Vitamin C Face Serum", "Serum", 499, 799, 30, "ml", oily, ["Dullness", "Pigmentation", "Dark spots"], ["Vitamin C", "Niacinamide"], 4.6, 1, true, true, true],
    ["deconstruct-serum", "Deconstruct", "Hydrating HA Face Serum", "Serum", 249, 399, 30, "ml", all, ["Dryness", "Fine lines", "Dullness"], ["Hyaluronic acid", "Panthenol"], 4.5, 6, true, true, true],
    ["dotkey-moisturizer", "Dot & Key", "72H Hydrating Gel Moisturizer", "Moisturizer", 349, 495, 50, "g", all, ["Dryness", "Dullness", "Fine lines"], ["Hyaluronic acid", "Probiotics"], 4.8, 2, true, true, false],
    ["plum-moisturizer", "Plum", "Green Tea Oil-Free Moisturizer", "Moisturizer", 169, 299, 35, "g", oily, ["Oiliness", "Acne"], ["Green tea", "Niacinamide"], 4.5, 2, true, true, true],
    ["simple-moisturizer", "Simple", "Hydrating Light Moisturizer", "Moisturizer", 299, 450, 125, "ml", all, ["Dryness", "Fine lines"], ["Pro-vitamin B5", "Glycerin"], 4.6, 7, true, true, true],
    ["derma-sunscreen", "The Derma Co", "1% Hyaluronic Sunscreen SPF 50", "Sunscreen", 399, 499, 50, "g", all, ["Dark spots", "Pigmentation", "Uneven skin tone"], ["Hyaluronic acid", "UV filters"], 4.7, 3, true, true, true],
    ["deconstruct-sunscreen", "Deconstruct", "Lightweight Gel Sunscreen SPF 50", "Sunscreen", 199, 349, 30, "g", all, ["Oiliness", "Dark spots", "Uneven skin tone"], ["UV filters", "Glycerin"], 4.5, 3, true, true, true],
    ["reequil-sunscreen", "Re’equil", "Ultra Matte Sunscreen SPF 50", "Sunscreen", 549, 695, 50, "g", oily, ["Oiliness", "Dark spots"], ["UV filters", "Silica"], 4.8, 3, false, true, false],
    ["plum-mask", "Plum", "Green Tea Clear Face Mask", "Face Mask", 249, 399, 60, "g", oily, ["Acne", "Oiliness"], ["Kaolin", "Green tea"], 4.4, 2, true, true, false],
    ["dotkey-mask", "Dot & Key", "Cica Calming Clay Mask", "Face Mask", 349, 495, 75, "g", oily, ["Acne", "Oiliness"], ["Cica", "Kaolin"], 4.5, 7, true, true, true],
    ["foxtale-mask", "Foxtale", "Hydrating Sleep Mask", "Face Mask", 299, 499, 50, "g", dry, ["Dryness", "Dullness"], ["Ceramides", "Squalane"], 4.6, 7, true, true, true],
    ["minimalist-eye", "Minimalist", "Caffeine Under Eye Cream", "Eye Care", 399, 599, 15, "g", all, ["Fine lines", "Dullness"], ["Caffeine", "Peptides"], 4.4, 7, true, true, true],
    ["plum-eye", "Plum", "Brightening Under Eye Gel", "Eye Care", 249, 399, 15, "g", all, ["Dullness", "Fine lines"], ["Caffeine", "Hyaluronic acid"], 4.3, 2, true, true, false],
    ["dotkey-eye", "Dot & Key", "Hydrating Eye Repair Cream", "Eye Care", 349, 499, 20, "g", dry, ["Dryness", "Fine lines"], ["Ceramides", "Peptides"], 4.5, 7, true, true, true],
    ["plum-lip", "Plum", "Nourishing Lip Balm", "Lip Care", 99, 199, 10, "g", all, ["Dryness"], ["Shea butter", "Vitamin E"], 4.5, 8, true, true, false],
    ["minimalist-lip", "Minimalist", "SPF 30 Lip Balm", "Lip Care", 199, 299, 8, "g", all, ["Dryness", "Pigmentation"], ["UV filters", "Shea butter"], 4.6, 8, true, true, true],
    ["dotkey-lip", "Dot & Key", "Ceramide Lip Treatment", "Lip Care", 149, 249, 12, "g", all, ["Dryness", "Dullness"], ["Ceramides", "Shea butter"], 4.5, 8, true, true, false]
  ];
  var usage = { Cleanser: "Massage a small amount onto damp skin, then rinse. Use morning and night.", Toner: "After cleansing, pat a little onto your skin. Avoid the eye area.", Serum: "After cleansing, apply 2–3 drops. Introduce one new product at a time and follow the product label.", Moisturizer: "Apply a small amount after cleansing and treatment. Use morning and night.", Sunscreen: "Apply generously as the last morning step. Reapply according to the product label, especially outdoors.", "Face Mask": "Use according to the product label, usually 1–2 times a week. Rinse clay masks; follow sleep mask instructions.", "Eye Care": "Gently pat a small amount around the orbital bone, avoiding direct contact with eyes.", "Lip Care": "Apply to lips as needed and follow the product label." };
  var products = rows.map(([id, brand, name, category, price, mrp, size, unit, skin2, concerns, ingredients2, rating, art, vegan, crueltyFree, fragranceFree], index) => ({
    id,
    brand,
    name,
    category,
    price,
    mrp,
    size,
    unit,
    skin: skin2,
    concerns,
    ingredients: ingredients2,
    rating,
    art,
    vegan,
    crueltyFree,
    fragranceFree,
    reviews: 128 + index * 31,
    tag: index % 5 === 0 ? "Bestseller" : index % 5 === 1 ? "Budget pick" : index % 5 === 2 ? "Skin favourite" : "",
    benefits: category === "Sunscreen" ? ["Daily sun protection", "Lightweight feel", "Easy routine essential"] : ["Designed for " + skin2.slice(0, 2).join(" & ") + " skin", "A simple " + category.toLowerCase() + " step", "Selected for " + concerns.slice(0, 2).join(" & ").toLowerCase()],
    use: usage[category],
    sellers: [{ name: "SkinMix", price }, { name: "Beauty Basket", price: Math.min(mrp, price + 45) }, { name: "Care Corner", price: Math.min(mrp, price + 80) }],
    description: "A sample " + category.toLowerCase() + " choice for your everyday routine. Compare the demo offers and mix it with products from other brands."
  }));
  var brands = [...new Set(products.map((p) => p.brand))];
  var ingredients = [...new Set(products.flatMap((p) => p.ingredients))].sort();

  // src/core.js
  var SKIN_TYPES = ["oily", "dry", "combination", "normal", "sensitive"];
  var CONCERNS = ["Acne", "Dark spots", "Pigmentation", "Dryness", "Oiliness", "Uneven skin tone", "Dullness", "Fine lines"];
  var CATEGORIES = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Face Mask", "Eye Care", "Lip Care"];
  var money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  var discount = (p) => Math.round((1 - p.price / p.mrp) * 100);
  function alertStatus(alert, p) {
    return { targetReached: p.price <= alert.target, priceDropped: p.price < alert.lastPrice, discountIncreased: discount(p) > (alert.lastDiscount ?? discount(p)) };
  }
  function totals(products2) {
    const original = products2.reduce((n, p) => n + p.mrp, 0), total = products2.reduce((n, p) => n + p.price, 0);
    return { original, total, savings: original - total, percent: original ? Math.round((original - total) / original * 100) : 0 };
  }
  var suits = (p, skin2) => !skin2 || p.skin.includes(skin2);
  var fitScore = (p, profile) => p.rating + (profile.concerns || []).filter((c) => p.concerns.includes(c)).length * 3 + (p.fragranceFree && profile.skin === "sensitive" ? 2 : 0);
  function recommendRoutine(catalog, profile) {
    const budget = Number(profile.budget);
    if (!Number.isFinite(budget) || budget <= 0 || budget > 1e5) throw new RangeError("Choose a budget between ₹1 and ₹1,00,000.");
    const required = ["Cleanser", "Moisturizer", "Sunscreen"];
    const pools = required.map((cat) => catalog.filter((p) => p.category === cat && suits(p, profile.skin)).sort((a, b) => a.price - b.price));
    const minimum = pools.every((p) => p.length) ? pools.reduce((n, p) => n + p[0].price, 0) : Infinity;
    let best = [], bestScore = -Infinity;
    if (minimum <= budget) {
      const serums = [null, ...catalog.filter((p) => p.category === "Serum" && suits(p, profile.skin))];
      for (const c of pools[0]) for (const m of pools[1]) for (const s of pools[2]) for (const serum of serums) {
        const products2 = [c, ...serum ? [serum] : [], m, s], cost = totals(products2).total;
        if (cost > budget) continue;
        const score = products2.reduce((n, p) => n + fitScore(p, profile), 0) + new Set(products2.map((p) => p.brand)).size * 0.7 - cost / budget;
        if (score > bestScore) {
          best = products2;
          bestScore = score;
        }
      }
    } else {
      let remaining = budget;
      for (const pool of pools) {
        if (pool[0] && pool[0].price <= remaining) {
          best.push(pool[0]);
          remaining -= pool[0].price;
        }
      }
    }
    const reasons = Object.fromEntries(best.map((p) => {
      const concern = (profile.concerns || []).find((c) => p.concerns.includes(c));
      return [p.id, `${p.category === "Sunscreen" ? "Adds daily sun protection" : p.category === "Cleanser" ? "A cleansing step" : p.category === "Moisturizer" ? "A hydration step" : "A targeted treatment"} for ${profile.skin} skin${concern ? `; chosen for your ${concern.toLowerCase()} preference` : ""}. ${money(p.price)} leaves room in your budget.`];
    }));
    return { products: best, reasons, incomplete: !required.every((cat) => best.some((p) => p.category === cat)), minimum, remaining: budget - totals(best).total };
  }
  function filterProducts(catalog, filters = {}) {
    let query = (filters.q || "").toLowerCase().trim();
    const priceMatch = query.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/);
    const queryMax = priceMatch ? Number(priceMatch[1].replaceAll(",", "")) : Infinity;
    const maxPrice = filters.max === void 0 || filters.max === null || filters.max === "" ? Infinity : Number(filters.max);
    if (priceMatch) query = query.replace(priceMatch[0], "");
    const querySkin = SKIN_TYPES.find((s) => query.includes(s + " skin"));
    if (querySkin) query = query.replace(querySkin + " skin", "");
    const tokens = query.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !["best", "for", "skin", "product", "products", "the", "a", "and", "with"].includes(w));
    const list = catalog.filter((p) => {
      const text2 = [p.name, p.brand, p.category, ...p.ingredients, ...p.concerns, ...p.skin].join(" ").toLowerCase();
      return tokens.every((t) => text2.includes(t)) && (!filters.category || p.category === filters.category) && (!filters.brand || p.brand === filters.brand) && suits(p, filters.skin || querySkin) && (!filters.concern || p.concerns.includes(filters.concern)) && (!filters.ingredient || p.ingredients.some((i) => i.toLowerCase().includes(filters.ingredient.toLowerCase()))) && p.price >= (Number(filters.min) || 0) && p.price <= Math.min(maxPrice, queryMax) && p.rating >= (Number(filters.rating) || 0) && discount(p) >= (Number(filters.discount) || 0) && ["vegan", "crueltyFree", "fragranceFree"].every((key) => !filters[key] || p[key]);
    });
    if (filters.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (filters.sort === "discount") list.sort((a, b) => discount(b) - discount(a));
    if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }
  function alternatives(product2, catalog, skin2) {
    return catalog.filter((p) => p.id !== product2.id && p.category === product2.category && p.price < product2.price && suits(p, skin2)).sort((a, b) => a.price - b.price);
  }
  function routineSections(products2) {
    const morningOrder = ["Cleanser", "Toner", "Serum", "Eye Care", "Moisturizer", "Sunscreen", "Lip Care"];
    const nightOrder = ["Cleanser", "Toner", "Serum", "Face Mask", "Eye Care", "Moisturizer", "Lip Care"];
    return Object.fromEntries([["morning", morningOrder], ["night", nightOrder]].map(([time, order]) => [time, order.flatMap((cat) => products2.filter((p) => p.category === cat))]));
  }
  function cartTotals(cart, catalog, coupon = "") {
    let original = 0, subtotal = 0, quantity = 0;
    for (const item of cart) {
      const p = catalog.find((p2) => p2.id === item.id);
      if (!p || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) continue;
      original += p.mrp * item.qty;
      subtotal += p.price * item.qty;
      quantity += item.qty;
    }
    const couponDiscount = coupon.toUpperCase() === "SKIN10" ? Math.min(150, Math.round(subtotal * 0.1)) : 0;
    const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 49;
    return { original, subtotal, productSavings: original - subtotal, couponDiscount, delivery, total: subtotal - couponDiscount + delivery, savings: original - subtotal + couponDiscount, quantity };
  }
  function sanitizeState(input, catalog) {
    const s = input && typeof input === "object" ? input : {};
    const ids = new Set(catalog.map((p) => p.id));
    const validIds = (value) => Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === "string" && ids.has(id)))] : [];
    const kitIds = (value) => {
      const seen = /* @__PURE__ */ new Set();
      return validIds(value).filter((id) => {
        const cat = catalog.find((p) => p.id === id).category;
        if (seen.has(cat)) return false;
        seen.add(cat);
        return true;
      });
    };
    const safeText = (value, max = 80) => typeof value === "string" ? value.slice(0, max) : "";
    const validBudget = (value) => Number.isFinite(Number(value)) && Number(value) >= 100 && Number(value) <= 1e5 ? Number(value) : 1500;
    const cart = (value) => Array.isArray(value) ? value.filter((i) => i && ids.has(i.id) && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 99).reduce((a, i) => {
      const old = a.find((v) => v.id === i.id);
      if (old) old.qty = Math.min(99, old.qty + i.qty);
      else a.push({ id: i.id, qty: i.qty });
      return a;
    }, []) : [];
    return {
      profile: { skin: SKIN_TYPES.includes(s.profile?.skin) ? s.profile.skin : "combination", concerns: Array.isArray(s.profile?.concerns) ? s.profile.concerns.filter((c) => CONCERNS.includes(c)) : ["Dullness"], budget: validBudget(s.profile?.budget) },
      kit: kitIds(s.kit),
      wishlist: validIds(s.wishlist),
      cart: cart(s.cart),
      recent: validIds(s.recent).slice(0, 12),
      savedKits: Array.isArray(s.savedKits) ? s.savedKits.filter((k) => k && typeof k.name === "string" && Array.isArray(k.ids)).slice(0, 30).map((k) => ({ id: safeText(k.id), name: safeText(k.name), ids: kitIds(k.ids), budget: validBudget(k.budget), date: safeText(k.date) })) : [],
      alerts: Array.isArray(s.alerts) ? s.alerts.filter((a) => a && ids.has(a.id) && Number.isFinite(a.target) && a.target > 0).map((a) => ({ id: a.id, target: a.target, lastPrice: Number.isFinite(a.lastPrice) ? a.lastPrice : catalog.find((p) => p.id === a.id).price, lastDiscount: Number.isFinite(a.lastDiscount) ? a.lastDiscount : discount(catalog.find((p) => p.id === a.id)) })) : [],
      orders: Array.isArray(s.orders) ? s.orders.filter((o) => o && typeof o.id === "string" && Number.isFinite(o.total) && o.total >= 0).slice(0, 30).map((o) => ({ id: safeText(o.id), date: safeText(o.date), total: o.total, items: cart(o.items) })) : [],
      preferences: { vegan: !!s.preferences?.vegan, fragranceFree: !!s.preferences?.fragranceFree, crueltyFree: !!s.preferences?.crueltyFree },
      coupon: s.coupon === "SKIN10" ? "SKIN10" : ""
    };
  }

  // src/store.js
  var STORAGE_KEY = "skinmix-v1";
  function loadState() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"), products);
    } catch {
      return sanitizeState({}, products);
    }
  }
  function persistState(state2) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state2));
      return true;
    } catch {
      return false;
    }
  }

  // src/icons.js
  var paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    heart: '<path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>',
    bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    home: '<path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M9 21v-8h6v8"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"/>',
    tag: '<path d="M3 3h9l9 9-9 9-9-9V3Z"/><circle cx="7.5" cy="7.5" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12 4 4 10-10"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    back: '<path d="m14 5-7 7 7 7"/>',
    leaf: '<path d="M4 20C1 9 8 3 21 3c0 12-6 19-17 17Z"/><path d="m4 20 11-11"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    moon: '<path d="M20.8 13a9 9 0 1 1-9.8-9.8 7 7 0 0 0 9.8 9.8Z"/>',
    bottle: '<rect x="7" y="8" width="10" height="13" rx="2"/><path d="M9 8V4h6v4M9 3h9M10 13h4"/>',
    dropper: '<path d="M9 3h6v5H9zM10 8v3h4V8M7 11h10v10H7V11Z"/><path d="M10 16h4"/>',
    jar: '<path d="M5 7h14v4H5zM4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8ZM9 16h6"/>',
    tube: '<path d="M6 3h12l-2 15H8L6 3ZM8 18h8v3H8zM10 8h4"/>',
    mask: '<path d="M5 4h14l1 8c0 6-8 9-8 9S4 18 4 12l1-8Z"/><path d="M7 10h3M14 10h3M9 16h6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    lip: '<path d="M6 9h12v12H6zM9 9V4l6-2v7M9 14h6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9ZM10 21h4"/>',
    truck: '<path d="M3 5h11v12H3zM14 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    filter: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
    swap: '<path d="M4 7h16l-4-4M20 17H4l4 4M20 7l-4 4M4 17l4-4"/>'
  };
  function icon(name, className = "") {
    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
  }
  var categoryIcons = { Cleanser: "bottle", Toner: "bottle", Serum: "dropper", Moisturizer: "jar", Sunscreen: "sun", "Face Mask": "mask", "Eye Care": "eye", "Lip Care": "lip" };

  // src/skin/core.js
  var GOALS = ["Acne/blemishes", "Dark spots", "Uneven tone", "Dryness", "Oiliness", "Dullness", "Texture", "Fine-line appearance", "Redness", "Sun protection"];
  var OBSERVATIONS = { blemishes: "Blemish appearance", lines: "Fine-line appearance", pigmentation: "Pigmentation appearance", tone: "Uneven tone", redness: "Redness appearance", texture: "Uneven texture", dryness: "Dryness", oiliness: "Oiliness", pores: "Visible pores" };
  var levels = ["not-assessed", "low", "moderate", "high"];
  var goalConcerns = (goals) => goals.map((g) => ({ "Acne/blemishes": "Acne", "Uneven tone": "Uneven skin tone", "Fine-line appearance": "Fine lines" })[g] || g).filter((g) => ["Acne", "Dark spots", "Uneven skin tone", "Dryness", "Oiliness", "Dullness", "Fine lines"].includes(g));
  function normalizeProfile(p = {}) {
    p = p && typeof p === "object" ? p : {};
    return { skin: ["oily", "dry", "combination", "normal", "sensitive", "not-sure"].includes(p.skin) ? p.skin : "not-sure", goals: Array.isArray(p.goals) ? [...new Set(p.goals.filter((g) => GOALS.includes(g)))] : [], experience: ["beginner", "intermediate", "advanced"].includes(p.experience) ? p.experience : "beginner", budget: Number.isFinite(Number(p.budget)) && Number(p.budget) >= 100 && Number(p.budget) <= 1e5 ? Number(p.budget) : 1500, observations: Object.fromEntries(Object.keys(OBSERVATIONS).map((k) => [k, levels.includes(p.observations?.[k]) ? p.observations[k] : "not-assessed"])) };
  }
  var text = (v, n = 1200) => typeof v === "string" ? v.slice(0, n) : "";
  var validDate = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d;
  var validRecord = (r) => r && validDate(r.date) && typeof r.id === "string" && /^[a-z0-9-]{1,80}$/i.test(r.id);
  function normalizeSkinState(input = {}, catalog = []) {
    const s = input && typeof input === "object" ? input : {}, settings = s.settings || {}, ids = new Set(catalog.map((p) => p.id));
    const record = (r) => ({ id: r.id, date: r.date, profile: normalizeProfile(r.profile), photoId: typeof r.photoId === "string" && /^[a-z0-9-]{1,80}$/i.test(r.photoId) ? r.photoId : null });
    return {
      settings: { consent: settings.consent === true, storePhotos: settings.storePhotos === true, saveHistory: settings.saveHistory !== false, photoCleanupPending: settings.photoCleanupPending === true, reminderMorning: settings.reminderMorning === true, reminderNight: settings.reminderNight === true, morningTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.morningTime) ? settings.morningTime : "08:00", nightTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.nightTime) ? settings.nightTime : "21:00" },
      profile: normalizeProfile(s.profile),
      latest: validRecord(s.latest) ? record(s.latest) : null,
      history: Array.isArray(s.history) ? s.history.filter(validRecord).slice(-40).map(record) : [],
      journal: Array.isArray(s.journal) ? s.journal.filter(validRecord).slice(-100).map((r) => ({ id: r.id, date: r.date, kind: text(r.kind, 60), note: text(r.note), productId: ids.has(r.productId) ? r.productId : "" })) : [],
      responses: Object.fromEntries(Object.entries(s.responses && typeof s.responses === "object" ? s.responses : {}).filter(([id, r]) => ids.has(id) && r && ["well", "no-change", "discomfort", "stopped"].includes(r.status)).map(([id, r]) => [id, { status: r.status, note: text(r.note, 500) }])),
      days: Array.isArray(s.days) ? s.days.filter((r) => r && validDate(r.date) && Array.isArray(r.steps) && Array.isArray(r.done)).slice(-366).map((r) => {
        const steps = [...new Set(r.steps.filter((k) => typeof k === "string" && k.length < 100))];
        return { date: r.date, steps, done: [...new Set(r.done.filter((k) => steps.includes(k)))] };
      }) : []
    };
  }
  function eligibleProducts(catalog, profile, responses = {}) {
    const p = normalizeProfile(profile);
    return catalog.filter((q) => (p.skin !== "not-sure" || q.skin.length === 5) && !["discomfort", "stopped"].includes(responses[q.id]?.status) && (p.skin !== "not-sure" && p.skin !== "sensitive" && !p.goals.includes("Redness") || q.fragranceFree) && (p.experience !== "beginner" || !q.ingredients.some((i) => /salicylic|vitamin c|retinol|glycolic|lactic acid/i.test(i))));
  }
  function recommendSkinRoutine(catalog, profile, responses = {}) {
    const p = normalizeProfile(profile), r = recommendRoutine(eligibleProducts(catalog, p, responses), { skin: p.skin === "not-sure" ? "" : p.skin, concerns: goalConcerns(p.goals), budget: p.budget });
    return { ...r, ...totals(r.products), reasons: Object.fromEntries(r.products.map((q) => [q.id, `${q.category} step; matched to your ${p.skin === "not-sure" ? "general care" : p.skin + " skin"} preference and ${p.budget} INR budget. ${q.concerns.filter((c) => goalConcerns(p.goals).includes(c)).join(", ") || "Everyday care"} sample catalog match. Individual tolerance varies.`])) };
  }
  function optimizeRoutine(catalog, ids, profile, responses = {}) {
    const before = catalog.filter((p) => ids.includes(p.id)), r = recommendSkinRoutine(catalog, profile, responses);
    return { ...r, beforeCount: before.length, afterCount: r.products.length, saved: Math.max(0, totals(before).total - r.total), notes: ["One product per purpose; optional toner, mask and eye steps removed.", "Beginner picks exclude stronger sample actives. This is not a medical ingredient compatibility check."] };
  }
  function snapshotObservations(obs = {}) {
    return Object.entries(OBSERVATIONS).map(([key, label]) => ({ key, label, value: levels.includes(obs[key]) && obs[key] !== "not-assessed" ? obs[key][0].toUpperCase() + obs[key].slice(1) : "Not assessed", source: "User-reported" }));
  }
  function scheduleFor(ids, catalog, responses = {}) {
    return routineSections(catalog.filter((p) => ids.includes(p.id) && !["discomfort", "stopped"].includes(responses[p.id]?.status)));
  }
  function localDay(d = /* @__PURE__ */ new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function reviewRoutine(picks, profile, responses = {}) {
    const notes = [], cats = picks.map((p) => p.category), active = picks.filter((p) => p.ingredients.some((i) => /salicylic|vitamin c|retinol|glycolic|lactic acid/i.test(i)));
    if (new Set(cats).size < cats.length) notes.push("Duplicate product purposes: consider keeping one product per step.");
    if (picks.length > 4) notes.push("Several optional steps: simplifying may reduce cost and make your response easier to track.");
    if (active.length > 1) notes.push("Multiple sample products list stronger actives. Review introducing them together with a qualified professional; no interaction testing is performed here.");
    if (totals(picks).total > normalizeProfile(profile).budget) notes.push("This routine exceeds your shopping budget. Compare cheaper options or optimize.");
    const missing = ["Cleanser", "Moisturizer", "Sunscreen"].filter((c) => !cats.includes(c));
    if (missing.length) notes.push("Missing basic steps: " + missing.join(", ") + ".");
    if (picks.some((p) => ["discomfort", "stopped"].includes(responses[p.id]?.status))) notes.push("Your kit still contains a stopped or uncomfortable product. It is omitted from checklists; rebuild or remove it.");
    return notes.length ? notes : ["A simple set of distinct steps. Check labels, directions and your own tolerance; this is not a suitability or interaction test."];
  }
  function completionSummary(days, windowDays, today = localDay()) {
    const end = Date.parse(today), rows2 = days.filter((r) => validDate(r.date) && Date.parse(r.date) <= end && Date.parse(r.date) > end - windowDays * 864e5), total = rows2.reduce((n, r) => n + r.steps.length, 0), done = rows2.reduce((n, r) => n + r.done.filter((k) => r.steps.includes(k)).length, 0);
    return { total, done, trackedDays: rows2.length, percent: total ? Math.round(done / total * 100) : 0 };
  }

  // src/skin/views.js
  function journeyView(s, ui2) {
    const week = completionSummary(s.days, 7), month = completionSummary(s.days, 30), history2 = [...s.history].reverse(), photos = history2.filter((r) => ui2.images[r.photoId]), before = ui2.images[ui2.before] || ui2.images[photos.at(-1)?.photoId], after = ui2.images[ui2.after] || ui2.images[photos[0]?.photoId];
    return `<div class="skin-section-title"><div><span class="eyebrow">SMALL STEPS, OVER TIME</span><h2>Your skin journey.</h2><p class="muted">Real entries from you. No simulated improvements or photo-derived scores.</p></div>${btn("Add a new check-in", "new-checkin", "", "primary")}</div><div class="skin-progress-layout"><section class="skin-card"><h3>Consistency, over time</h3><div class="skin-bars">${s.days.slice(-7).map((d) => `<div><span>${d.steps.length ? Math.round(d.done.length / d.steps.length * 100) : 0}%</span><i style="--bar:${d.steps.length ? d.done.length / d.steps.length * 100 : 0}%"></i><small>${d.date.slice(5)}</small></div>`).join("") || '<p class="muted">Check your first routine step to start this chart.</p>'}</div><p>${week.percent}% over 7 days · ${month.percent}% over 30 days</p><p class="skin-small-note">Percentages use completed / recorded steps. Untracked days aren’t counted.</p></section><section class="skin-card"><h3>Appearance check-ins</h3>${history2.length ? Object.entries(OBSERVATIONS).map(([k, l]) => {
      const first = history2.at(-1).profile.observations[k], last = history2[0].profile.observations[k];
      return `<p class="skin-change"><span>${l}</span><b>${esc(first)} → ${esc(last)}</b></p>`;
    }).join("") : '<p class="muted">Complete a skin snapshot to begin tracking your own observations.</p>'}<p class="skin-small-note">Self-reported appearance only. Changes do not establish product effectiveness.</p></section></div><section class="skin-card"><div class="skin-section-title"><h3>Your check-in timeline</h3><a class="text-link" href="#analyzer/privacy">Manage photos</a></div><div class="skin-milestones">${[["Day 1", "Start"], ["Week 2", "Reflect"], ["Week 4", "Review"], ["Week 8", "Revisit"]].map(([d, l]) => `<span><b>${d}</b>${l}</span>`).join("")}</div><p class="skin-small-note">Suggested milestones, not promised result dates. Your actual check-ins appear below.</p><div class="skin-timeline">${history2.map((r) => `<article>${ui2.images[r.photoId] ? `<img src="${ui2.images[r.photoId]}" alt="Your saved check-in photo from ${r.date}">` : `<div class="skin-timeline-placeholder">${icon("user")}<span>No saved photo</span></div>`}<b>${r.date}</b><span>${esc(r.profile.skin)} · ${money(r.profile.budget)}</span><small>${esc(r.profile.goals.join(", ") || "Everyday care")}</small></article>`).join("") || '<p class="muted">Your diary is empty. Add a profile check-in to start.</p>'}</div></section><section class="skin-card"><span class="eyebrow">SEE YOUR STORY SIDE BY SIDE</span><h2>Before & current</h2><p class="muted">Lighting, camera, filters and makeup affect comparisons. This is a photo viewer, not an improvement assessment.</p>${photos.length >= 2 ? `<div class="skin-form-grid"><label>Before photo<select id="skin-before">${photos.map((r) => option(r.photoId, r.date + " · " + r.id.slice(-4), ui2.before || photos.at(-1).photoId)).join("")}</select></label><label>Current photo<select id="skin-after">${photos.map((r) => option(r.photoId, r.date + " · " + r.id.slice(-4), ui2.after || photos[0].photoId)).join("")}</select></label></div><div class="skin-side-by-side"><figure><img src="${before}" alt="Selected before photo"><figcaption>Before · ${photos.find((r) => r.photoId === (ui2.before || photos.at(-1).photoId))?.date}</figcaption></figure><figure><img src="${after}" alt="Selected current photo"><figcaption>Current · ${photos.find((r) => r.photoId === (ui2.after || photos[0].photoId))?.date}</figcaption></figure></div><div class="skin-compare"><img src="${after}" alt="Current photo for comparison"><img id="skin-compare-before" class="skin-compare-before" src="${before}" alt="Before photo for comparison" style="clip-path:inset(0 50% 0 0)"><span>Before</span><span>Current</span><i id="skin-compare-line" style="left:50%"></i></div><label class="skin-slider-label">Slide to compare<input type="range" id="skin-compare-slider" min="0" max="100" value="50"></label>` : '<div class="skin-empty"><p>Save at least two photos to compare them here.</p><p class="small muted">Photo saving is optional and off by default. Enable it in Privacy before adding photo check-ins.</p><a class="button secondary" href="#analyzer/privacy">Photo preferences</a></div>'}</section><section class="skin-card"><span class="eyebrow">THE LITTLE THINGS YOU NOTICE</span><h2>My skin journal</h2><form id="skin-journal-form" class="skin-form"><div class="skin-form-grid"><label>Date<input name="date" type="date" value="${localDay()}" max="${localDay()}" required></label><label>Observation type<select name="kind">${["General observation", "New product", "Irritation", "Dryness", "Breakouts", "Routine change"].map((v) => option(v, v, "")).join("")}</select></label></div><label>Related product (optional)<select name="productId"><option value="">None</option>${products.map((p) => option(p.id, p.brand + " · " + p.name, "")).join("")}</select></label><label>My notes<textarea name="note" maxlength="1200" required placeholder="How did your skin feel today?"></textarea></label><button class="button primary" type="submit">Add Journal Entry</button></form><div class="skin-journal">${[...s.journal].reverse().map((r) => `<article><div><span class="brand-name">${r.date} · ${esc(r.kind)}</span><p>${esc(r.note)}</p>${r.productId ? `<small>${esc(products.find((p) => p.id === r.productId)?.name)}</small>` : ""}</div>${btn("Delete", "delete-entry", `data-id="${r.id}"`)}</article>`).join("") || '<p class="muted">No journal entries yet. Your notes stay on this device.</p>'}</div></section>`;
  }
  function privacyView(s) {
    const t = s.settings;
    return `<section class="skin-card skin-privacy"><span class="eyebrow">YOUR SKIN. YOUR DATA. YOUR CHOICE.</span><h2>A private little care space.</h2><p>Photos are resized in your browser and their file metadata is removed. No images or skin profiles are sent to a server. This prototype does not run face recognition, a skin AI model, or advertising analysis.</p><form id="skin-privacy-form" class="skin-form">${check("consent", "Allow local photo processing for my private previews.", t.consent)}${check("storePhotos", "Keep my photos on this browser for progress comparisons.", t.storePhotos)}${check("saveHistory", "Save my skin profile, check-ins, journal and checklist history on this browser.", t.saveHistory)}<p class="skin-small-note">Photos are off by default. Turning photo saving off deletes saved photos. Turning history saving off deletes saved skin history; new entries then last only for this session. Shopping kits and the cart are separate.</p><fieldset><legend>Gentle reminders</legend><div class="skin-form-grid"><div>${check("reminderMorning", "Morning reminder", t.reminderMorning)}<label>Morning time<input name="morningTime" type="time" value="${t.morningTime}" required></label></div><div>${check("reminderNight", "Night reminder", t.reminderNight)}<label>Night time<input name="nightTime" type="time" value="${t.nightTime}" required></label></div></div><p class="skin-small-note">Reminders appear inside SkinMix while this page is open. No background or email notifications. Times follow your device clock.</p></fieldset><button class="button primary" type="submit">Save Privacy Preferences</button></form><div class="skin-privacy-policy"><h3>Local privacy policy</h3><p>Your photo is temporary unless you opt into browser storage. Saved images use this browser’s IndexedDB; profile and journal records use localStorage. Anyone using this browser profile may access them. Browser clearing, private mode and changing folders or browsers can remove or isolate data. Saving is not a backup service.</p><p>Your data is used only for this feature. It is not shared for unrelated purposes, training or ads. There is no account or cloud sync. Delete images and history separately below; disabling consent stops camera access and removes images.</p><p>Recommendations use a sample catalog and your answers. They are not medical advice or a guarantee of results. For persistent or significant skin concerns, consult a qualified dermatologist.</p></div><div class="skin-delete-panel"><div><h3>Start fresh, whenever you like.</h3><p>Clear your images or your complete skin diary. Your shopping bag and saved kits stay separate.</p></div>${btn("Delete All Images", "confirm-images")}${btn("Delete Skin History", "confirm-history")}</div></section>`;
  }
  function learnView() {
    return `<section class="skin-section-title"><div><span class="eyebrow">A SOFTER START</span><h2>Skincare, made simple.</h2><p class="muted">General education, not an individualized treatment plan.</p></div></section><div class="skin-learn-grid">${[
      ["01", "Cleanse gently", "Choose a gentle cleanser. Avoid scrubbing; follow the product directions."],
      ["02", "Make room for moisture", "A moisturizer helps support a simple everyday care routine. Choose for comfort and your preferences."],
      ["03", "Protect with sunscreen", "Use broad-spectrum SPF 30 or higher. Follow label directions and reapply outdoors; add shade and protective clothing."],
      ["04", "Start small", "Begin with cleanser, moisturizer and sunscreen. More steps do not always mean better results."],
      ["05", "Test a new product", "The AAD suggests testing a small spot twice daily for 7–10 days before adding a product to your routine."],
      ["06", "Introduce one at a time", "Add products gradually so you can notice your own response. If a product irritates your skin, stop using it."],
      ["07", "Read beyond the ingredient", "Ingredients describe a product’s contents; concentration and formulation matter. Catalog matching cannot predict your individual response."]
    ].map(([n, t, p]) => `<article class="skin-card"><span class="skin-learn-number">${n}</span><h3>${t}</h3><p>${p}</p></article>`).join("")}</div><section class="skin-card"><h3>Read the source</h3><p class="muted">American Academy of Dermatology public guidance:</p><div class="skin-source-links"><a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget" target="_blank" rel="noopener noreferrer">Skincare on a budget ↗</a><a href="https://www.aad.org/public/everyday-care/skin-care-secrets/prevent-skin-problems/test-skin-care-products" target="_blank" rel="noopener noreferrer">Testing new skincare products ↗</a><a href="https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen" target="_blank" rel="noopener noreferrer">Applying sunscreen ↗</a><a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-in-your-20s" target="_blank" rel="noopener noreferrer">Building a simple routine ↗</a></div></section>`;
  }
  var skinBanner = () => `<section class="skin-banner"><div class="skin-orbit" aria-hidden="true">${icon("user")}<span class="orbit-dot">${icon("sparkles")}</span></div><div><span class="eyebrow">MEET YOUR SKIN, A LITTLE BETTER</span><h2>What’s your skin story?</h2><p>Understand your skin. Build your routine. Track your progress.</p><span class="skin-pill">Private, guided skin profile · no connected AI</span></div><div class="skin-banner-actions"><a class="button primary" href="#analyzer">Analyze My Skin ${icon("chevron")}</a><a class="text-link" href="#analyzer/routine">Build My Routine</a></div></section>`;
  var btn = (label, action, extra = "", style = "secondary") => `<button type="button" class="button ${style}" data-skin-action="${action}" ${extra}>${label}</button>`;
  var option = (v, label, selected) => `<option value="${esc(v)}" ${v === selected ? "selected" : ""}>${esc(label)}</option>`;
  var check = (name, label, value) => `<label class="skin-check"><input type="checkbox" name="${name}" ${value ? "checked" : ""}>${label}</label>`;
  var note = `<div class="skin-disclaimer">${icon("shield")}<p>Cosmetic guidance only. This browser prototype does not detect conditions from photos, diagnose skin, or replace a dermatologist. Recommendations use your answers and a sample product catalog; results and tolerance vary.</p></div>`;
  function skinShell(route, body) {
    const tab = route.split("/")[1] || "start";
    return `<div class="container skin-page"><div class="skin-heading"><div><span class="eyebrow">YOUR PERSONAL CARE SPACE</span><h1>AI Skin Analyzer <span>guided preview</span></h1><p>Understand your skin. Build your routine. Track your progress.</p></div><a class="skin-privacy-link" href="#analyzer/privacy">${icon("shield")} Private by design</a></div><nav class="skin-tabs" aria-label="Skin analyzer navigation">${[["start", "My skin", "analyzer"], ["snapshot", "Snapshot", "analyzer/snapshot"], ["routine", "My routine", "analyzer/routine"], ["journey", "Progress & journal", "analyzer/journey"], ["learn", "Skin basics", "analyzer/learn"], ["privacy", "Privacy", "analyzer/privacy"]].map(([id, l, href]) => `<a href="#${href}" ${tab === id ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>${body}${note}</div>`;
  }
  function startView(s, ui2) {
    return `<section class="skin-intro"><div><span class="eyebrow">A LITTLE CLARITY. A LOT MORE YOU.</span><h2>Discover what<br>your skin <em>needs.</em></h2><p>A thoughtful routine starts with your story. Add a photo for your private diary, tell us what you notice, and find care that fits your budget.</p><div class="skin-process"><span><b>01</b> Photo & preferences</span><span><b>02</b> Your skin snapshot</span><span><b>03</b> A routine that fits</span></div><ul class="skin-photo-tips"><li>Use indirect daylight and no beauty filters.</li><li>Face forward; remove heavy makeup if comfortable.</li><li>Use similar lighting and angles for progress photos.</li></ul><a class="text-link" href="#analyzer/learn">New to skincare? Start simple ${icon("chevron")}</a></div><div class="skin-upload-card"><span class="skin-pill">${icon("shield")} Processed on this device</span><div class="skin-photo ${ui2.scanning ? "is-scanning" : ""}">${ui2.photo ? `<img src="${ui2.photo.dataUrl}" alt="Your private photo preview">` : `<div class="skin-face-guide">${icon("user")}<span>Your photo here</span></div>`}${ui2.scanning ? '<div class="skin-scan-line"></div>' : ""}</div><p id="skin-media-message" role="status">${esc(ui2.message || ui2.photo?.lighting || "Your photo is optional. Your answers guide the recommendations.")}</p><div class="skin-upload-actions">${btn("Take a selfie", "camera", !s.settings.consent ? "disabled" : "")}${btn("Upload photo", "upload", !s.settings.consent ? "disabled" : "")}</div><input id="skin-photo-input" type="file" accept="image/jpeg,image/png,image/webp" hidden><span class="small muted">JPG, PNG or WebP · up to 8 MB</span>${check("skin-consent", "I agree to local photo processing and understand this is a guided cosmetic prototype.", s.settings.consent)}${check("skin-store-photos", "Keep my photos on this device for progress comparisons (optional).", s.settings.storePhotos)}${btn(ui2.scanning ? "Preparing your preview…" : ui2.photo ? "Continue with my photo" : "Continue without a photo", "continue", (!s.settings.consent || ui2.scanning ? "disabled" : "") + ' id="skin-continue"', "primary")}<p class="skin-small-note">No upload to a server. Photos are discarded on reload unless you choose to keep them. No face recognition or skin detection runs here.</p></div></section>${ui2.stage === "questions" ? questionnaire(s) : ""}`;
  }
  function questionnaire(s) {
    const p = s.profile;
    return `<section id="skin-questions" class="skin-card"><span class="eyebrow">STEP 02 · TELL US ABOUT YOU</span><h2>Let your skin lead the way.</h2><p class="muted">These answers—not image detection—create your profile and product matches.</p><form id="skin-profile-form" class="skin-form"><div class="skin-form-grid"><label>My skin feels<select name="skin">${["not-sure", "dry", "oily", "combination", "normal", "sensitive"].map((v) => option(v, v === "not-sure" ? "Not sure" : v[0].toUpperCase() + v.slice(1), p.skin)).join("")}</select></label><label>My skincare experience<select name="experience">${["beginner", "intermediate", "advanced"].map((v) => option(v, v, p.experience)).join("")}</select></label><label>Monthly shopping budget<select name="budget-range">${[[499, "Under ₹500"], [999, "₹500–₹1,000"], [1999, "₹1,000–₹2,000"], [2999, "₹2,000–₹3,000"], [4e3, "₹3,000+"]].map(([v, l]) => option(String(v), l, String(p.budget))).join("")}<option value="custom" selected>Custom amount</option></select></label><label>Budget in ₹<input name="budget" type="number" min="100" max="100000" step="1" value="${p.budget}" required></label></div><fieldset><legend>What would you like to focus on?</legend><div class="skin-goals">${GOALS.map((g) => `<label><input type="checkbox" name="goals" value="${g}" ${p.goals.includes(g) ? "checked" : ""}><span>${g}</span></label>`).join("")}</div></fieldset><details class="skin-observation-form"><summary>Optional: record what you notice in your photo</summary><p class="small muted">Your own appearance ratings. Leave unknown items unassessed; lighting can change how they look.</p><div class="skin-form-grid">${Object.entries(OBSERVATIONS).map(([k, l]) => `<label>${l}<select name="obs-${k}">${["not-assessed", "low", "moderate", "high"].map((v) => option(v, v === "not-assessed" ? "Not assessed" : v, p.observations[k])).join("")}</select></label>`).join("")}</div></details><button class="button primary" type="submit">Create My Skin Snapshot ${icon("sparkles")}</button></form></section>`;
  }
  function snapshotView(s, ui2, r) {
    if (!s.latest) return `<section class="skin-card skin-empty">${icon("user")}<h2>A fresh start for your skin.</h2><p>Complete your profile to see your snapshot and sample product matches.</p><a class="button primary" href="#analyzer">Analyze My Skin</a></section>`;
    const p = s.profile;
    return `<section class="skin-snapshot-head"><div><span class="eyebrow">YOUR SNAPSHOT · ${s.latest.date}</span><h2>A little more understanding.</h2><p>${p.skin === "not-sure" ? "Skin type: not sure" : esc(p.skin) + " skin"} · ${esc(p.experience)} · ${money(p.budget)} budget</p><div class="skin-goal-tags">${p.goals.map((g, i) => `<span class="skin-pill">${i < 2 ? "Primary" : "Secondary"} · ${g}</span>`).join("") || '<span class="skin-pill">Everyday care</span>'}</div></div>${ui2.photo ? `<img class="skin-snapshot-photo" src="${ui2.photo.dataUrl}" alt="Your photo alongside your self-reported snapshot">` : ""}</section><div class="skin-section-title"><h2>What you’ve noticed</h2><span class="skin-pill">User-reported · not image-derived</span></div><div class="skin-observation-grid">${snapshotObservations(p.observations).map((o) => `<article class="skin-observation"><span>${o.label}</span><strong class="level-${p.observations[o.key]}">${o.value}</strong><div class="skin-level"><i style="width:${{ "low": 25, moderate: 55, high: 90 }[p.observations[o.key]] || 0}%"></i></div></article>`).join("")}</div><div class="skin-next"><div><h3>Your next step: a simple routine.</h3><p>${r.products.length} sample picks · ${money(r.total)} · ${money(r.savings)} below sample MRP.</p>${r.incomplete ? '<p class="skin-warning">Your budget cannot cover all three essentials. Increase it or review missing steps.</p>' : ""}</div><a class="button primary" href="#analyzer/routine">See My Routine ${icon("chevron")}</a>${btn("Update profile", "questions")}</div>`;
  }
  function routineProduct(p, reason) {
    return `<article class="skin-product"><a class="skin-product-art" href="#product/${p.id}">${productArt(p)}</a><div><span class="brand-name">${p.brand} · ${p.category}</span><h3><a href="#product/${p.id}">${p.name}</a></h3><p class="small muted">${p.size} ${p.unit} · ★ ${p.rating} (sample) · ${unitPrice(p)}/${p.unit}</p><p class="skin-ingredients">${esc(p.ingredients.join(" · "))}</p><p class="skin-reason">${esc(reason || "Selected in your current kit. Review ingredients and your own tolerance.")}</p><div class="skin-price"><strong>${money(p.price)}</strong><s>${money(p.mrp)}</s><span>Save ${money(p.mrp - p.price)}</span></div><div class="skin-product-actions">${btn("Compare options", "alternatives", `data-id="${p.id}"`)}<a class="text-link" href="#product/${p.id}">Details & sellers</a>${btn("Remove", "remove", `data-id="${p.id}"`)}</div></div></article>`;
  }
  function routineView(s, ui2, r, shop) {
    const picks = shop.kit.map((id) => products.find((p) => p.id === id)).filter(Boolean), t = totals(picks), schedule = scheduleFor(shop.kit, products, s.responses), today = s.days.find((d) => d.date === localDay()), week = completionSummary(s.days, 7), month = completionSummary(s.days, 30);
    return `<div class="skin-section-title"><div><span class="eyebrow">CARE THAT FITS YOUR LIFE</span><h2>Your routine, your rhythm.</h2><p class="muted">Multi-brand sample recommendations from your answers. No single product is guaranteed best for your face.</p></div>${btn("Build from my profile", "recommend", "", "primary")}</div><div class="skin-routine-layout"><div>${picks.length ? picks.map((p) => routineProduct(p, r.reasons[p.id])).join("") : '<div class="skin-card skin-empty"><h3>Begin with the essentials.</h3><p>Build your profile or generate a simple routine from your current preferences.</p><a class="button secondary" href="#analyzer">Complete My Profile</a></div>'}</div><aside class="skin-budget skin-card"><span class="eyebrow">A LITTLE CARE. LESS SPEND.</span><h3>My routine budget</h3><div class="skin-budget-number">${money(t.total)} <span>/ ${money(s.profile.budget)}</span></div><div class="skin-meter"><i style="width:${Math.min(100, t.total / s.profile.budget * 100)}%" class="${t.total > s.profile.budget ? "over" : ""}"></i></div><p class="${t.total > s.profile.budget ? "skin-warning" : "green-text"}">${t.total > s.profile.budget ? money(t.total - s.profile.budget) + " over budget" : money(s.profile.budget - t.total) + " room in your budget"}</p><dl><div><dt>Sample MRP</dt><dd>${money(t.original)}</dd></div><div><dt>Sample savings</dt><dd>${money(t.savings)}</dd></div><div><dt>Essential steps</dt><dd>${["Cleanser", "Moisturizer", "Sunscreen"].filter((c) => picks.some((p) => p.category === c)).length}/3</dd></div></dl>${btn("Optimize My Routine", "optimize", picks.length ? "" : "disabled", "primary")}<p class="skin-small-note">Remove duplicates and optional excess; find budget fits. Ingredient flags are a review prompt, not a safety check.</p>${ui2.optimized ? `<div class="skin-optimization" role="status"><strong>${ui2.optimized.beforeCount} → ${ui2.optimized.afterCount} products</strong><p>Saved ${money(ui2.optimized.saved)} by changing the mix.</p>${ui2.optimized.notes.map((n) => `<p>${n}</p>`).join("")}</div>` : ""}${picks.length ? '<button class="button secondary" data-action="kit-cart">Add Routine to Bag</button>' : ""}<a class="text-link" href="#builder">Customize in Build Kit ${icon("chevron")}</a><p class="skin-small-note">Purchase total, not monthly usage cost. Prices and ratings are samples.</p></aside></div><section class="skin-daily"><div class="skin-section-title"><div><span class="eyebrow">LITTLE HABITS, EVERY DAY</span><h2>Today’s care checklist</h2><p class="muted">${localDay()} · Counts reflect checked steps, not skin improvement.</p></div><a class="text-link" href="#analyzer/privacy">Set reminders ${icon("bell")}</a></div><div class="skin-stat-grid"><div><strong>${today?.done.length || 0}/${today?.steps.length || 0}</strong><span>Today’s recorded steps</span></div><div><strong>${week.percent}%</strong><span>7-day consistency · ${week.trackedDays} days tracked</span></div><div><strong>${month.percent}%</strong><span>30-day consistency · ${month.trackedDays} days tracked</span></div></div><div class="skin-schedule">${Object.entries(schedule).map(([time, ps]) => `<article class="skin-card"><h3>${icon(time === "morning" ? "sun" : "moon")} ${time === "morning" ? "Morning" : "Night"} routine</h3>${ps.length ? ps.map((p, i) => `<label class="skin-step"><input type="checkbox" data-skin-step="${time}:${p.id}" ${today?.done.includes(time + ":" + p.id) ? "checked" : ""}><span class="skin-step-number">${i + 1}</span><span><b>${p.category}</b><small>${p.brand} · ${p.name}</small></span><a href="#product/${p.id}">How to use</a></label>`).join("") : '<p class="muted">Build a routine to start your checklist.</p>'}</article>`).join("")}</div><p class="skin-small-note">Stopped or uncomfortable products are omitted from checklists. Past days keep the steps recorded at that time. Sunscreen appears in the morning only; follow product directions.</p></section><section class="skin-card"><span class="eyebrow">A THOUGHTFUL ROUTINE REVIEW</span><h3>Before you add another step</h3><ul class="skin-review">${reviewRoutine(picks, s.profile, s.responses).map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>${responseView(s, picks)}`;
  }
  function responseView(s, picks) {
    return `<section class="skin-card"><span class="eyebrow">LISTEN TO YOUR SKIN</span><h2>How is your product feeling?</h2><p class="muted">Track your own experience. Uncomfortable or stopped products won’t enter new recommendations.</p>${picks.length ? `<form id="skin-response-form" class="skin-form"><div class="skin-form-grid"><label>Product<select name="productId" id="skin-response-product">${picks.map((p) => option(p.id, p.brand + " · " + p.name, "")).join("")}</select></label><label>My experience<select name="status" id="skin-response-status">${[["well", "Working well"], ["no-change", "No noticeable change"], ["discomfort", "Discomfort / irritation"], ["stopped", "Stopped using"]].map(([v, l]) => option(v, l, "well")).join("")}</select></label></div><label>Notes<textarea name="note" id="skin-response-note" maxlength="500" placeholder="When did you start? What did you notice?"></textarea></label><button class="button secondary" type="submit">Save Product Response</button></form>` : "<p>Add a routine first to log product responses.</p>"}<div class="skin-response-list">${Object.entries(s.responses).map(([id, v]) => `<p><b>${esc(products.find((p) => p.id === id)?.name)}</b> · ${esc(v.status)}${v.note ? " — " + esc(v.note) : ""}</p>`).join("")}</div>${Object.values(s.responses).some((v) => v.status === "discomfort") ? '<div class="skin-warning">If a product causes significant irritation, stop using it and seek advice from a qualified dermatologist. This feature cannot diagnose the cause.</div>' : ""}</section>`;
  }

  // src/views.js
  var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var unitPrice = (p) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p.price / p.size);
  var productArt = (p) => `<div class="product-art art-${p.art}" role="img" aria-label="Generic demo ${esc(p.category.toLowerCase())} packaging"></div>`;
  function productCard(p, state2) {
    const selected = state2.kit.includes(p.id), saved = state2.wishlist.includes(p.id);
    return `<article class="product-card"><div class="product-visual"><a href="#product/${p.id}" aria-label="View ${esc(p.name)}">${productArt(p)}</a><span class="discount-badge">${discount(p)}% OFF</span><button class="heart-button ${saved ? "is-saved" : ""}" data-action="wishlist" data-id="${p.id}" aria-label="${saved ? "Remove" : "Save"} ${esc(p.name)} ${saved ? "from" : "to"} wishlist" aria-pressed="${saved}">${icon("heart")}</button>${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}</div><div class="product-info"><p class="brand-name">${p.brand}</p><a href="#product/${p.id}" class="product-name">${p.name}</a><div class="product-meta"><span>${p.size} ${p.unit}</span><span class="rating">${icon("star")} ${p.rating} <span class="muted">(${p.reviews})</span></span></div><div class="product-price"><strong>${money(p.price)}</strong><s>${money(p.mrp)}</s><span class="save-label">Save ${money(p.mrp - p.price)}</span></div><div class="product-unit">${unitPrice(p)} / ${p.unit}</div><button class="add-kit ${selected ? "selected" : ""}" data-action="add-kit" data-id="${p.id}">${icon(selected ? "check" : "plus")}${selected ? "Added to Kit" : "Add to Kit"}</button></div></article>`;
  }
  var productGrid = (list, state2) => `<div class="product-grid">${list.map((p) => productCard(p, state2)).join("")}</div>`;
  function header(state2, route) {
    const count = state2.cart.reduce((n, i) => n + i.qty, 0);
    return `<div class="header-main container"><a href="#home" class="wordmark" aria-label="SkinMix home">skin<span>mix</span><span class="logo-dot">✳</span></a><form id="search-form" class="search-form" role="search">${icon("search")}<input id="search-input" name="q" type="search" placeholder="Find your next skin favourite" aria-label="Search products" autocomplete="off"><button type="submit" class="search-submit" aria-label="Search">${icon("chevron")}</button><div id="suggestions" class="suggestions" hidden></div></form><div class="header-actions"><a href="#wishlist" class="header-icon" aria-label="Wishlist">${icon("heart")}${state2.wishlist.length ? `<span class="count">${state2.wishlist.length}</span>` : ""}</a><a href="#cart" class="header-icon" aria-label="Shopping bag">${icon("bag")}${count ? `<span class="count">${count}</span>` : ""}</a><a href="#profile" class="header-icon profile-icon" aria-label="Your profile">${icon("user")}</a></div></div><div class="nav-line"><nav class="desktop-nav container" aria-label="Main navigation">${[["home", "Home"], ["discover", "Discover"], ["analyzer", "AI Skin Analyzer"], ["builder", "Build My Kit"], ["deals", "Deals"], ["profile", "My Skin Profile"]].map(([id, label]) => `<a href="#${id}" class="${route === id ? "active" : ""} ${id === "builder" ? "builder-link" : ""}">${id === "builder" ? icon("sparkles") : ""}${label}${id === "deals" ? '<span class="nav-offer">SALE</span>' : ""}</a>`).join("")}<span class="nav-note">${icon("leaf")} A routine as unique as you</span></nav></div>`;
  }
  function bottomNav(route) {
    return [["home", "Home", "home"], ["analyzer", "Analyze", "eye"], ["builder", "Build Kit", "sparkles"], ["discover", "Shop", "grid"], ["profile", "Profile", "user"]].map(([id, label, i]) => `<a href="#${id}" class="${route === id ? "active" : ""} ${id === "builder" ? "central-nav" : ""}"><span>${icon(i)}</span>${label}</a>`).join("");
  }
  function renderHome(state2) {
    const deals = ["minimalist-serum", "dotkey-moisturizer", "derma-sunscreen", "simple-cleanser"].map((id) => products.find((p) => p.id === id));
    return `<div class="container home-page"><section class="hero"><div class="hero-media"><img src="assets/skincare-hero.png" alt="Serum, moisturizer and skincare tube arranged on warm stone with a botanical sprig" fetchpriority="high"></div><div class="hero-content"><span class="eyebrow">A LITTLE SELF-CARE, YOUR WAY</span><h1>Build your perfect<br>skincare <em>kit.</em></h1><p>Mix brands. Match your skin.<br> Stay within your budget.</p><div class="hero-buttons"><a class="button primary" href="#builder">${icon("sparkles")} Build My Kit</a><a class="button secondary" href="#deals">Explore Deals</a></div><div class="hero-proof"><span>${icon("check")} Your skin, your picks</span><span>${icon("check")} More glow. Less spend.</span></div></div><div class="hero-sticker">a little mix.<br><em>a lot of you.</em>${icon("leaf")}</div><div class="hero-savings">${icon("tag")}<div><strong>Good skin. Better prices.</strong><span>Discover up to 50% off · sample deals</span></div></div></section><div class="trust-strip"><span>${icon("bag")} Your favourites, across brands</span><span>${icon("sparkles")} Personalized to your skin</span><span>${icon("tag")} Small budgets, big possibilities</span></div>${skinBanner()}<section class="category-section"><div class="section-head"><div><span class="eyebrow">EVERY STEP, MADE SIMPLE</span><h2>What’s your skin craving?</h2></div><a href="#discover" class="text-link">Explore all ${icon("chevron")}</a></div><div class="category-grid">${CATEGORIES.map((c, i) => `<button class="category-item category-${i}" data-action="category" data-category="${c}"><span class="category-symbol">${icon(categoryIcons[c])}</span><span>${c}</span></button>`).join("")}</div></section><section><div class="section-head"><div><span class="eyebrow">GLOW MORE, SPEND LESS</span><h2>Today’s best deals <span class="little-sparkle">✳</span></h2><p>Good-for-your-skin picks. Even better prices.</p></div><a class="text-link" href="#deals">View all deals ${icon("chevron")}</a></div>${productGrid(deals, state2)}</section><section class="budget-banner"><div class="budget-banner-icon">${icon("sparkles")}</div><div><span class="eyebrow">YOUR BUDGET IS BEAUTIFUL</span><h2>A whole routine. Under ₹999.</h2><p>Cleanse, hydrate, protect. Your essentials, all in one mix.</p></div><button class="button primary" data-action="budget-kit" data-budget="999">Build Under ₹999</button></section><section class="curated-section"><div class="section-head"><div><span class="eyebrow">LET YOUR SKIN LEAD THE WAY</span><h2>Find your kind of care</h2></div></div><div class="curated-grid"><button class="curated-card acne" data-action="concern" data-concern="Acne"><span>${icon("leaf")} CLEAR & CALM</span><h3>Best for acne</h3><p>A little less stress for your skin.</p><span class="text-link">Explore acne care ${icon("chevron")}</span></button><button class="curated-card dry" data-action="skin" data-skin="dry"><span>${icon("jar")} SOFT & NOURISHED</span><h3>Best for dry skin</h3><p>Meet your new hydration heroes.</p><span class="text-link">Find your hydration ${icon("chevron")}</span></button><button class="curated-card spf" data-action="category" data-category="Sunscreen"><span>${icon("sun")} EVERYDAY PROTECTION</span><h3>Sunscreen deals</h3><p>For all your days in the sun.</p><span class="text-link">Shop SPF favourites ${icon("chevron")}</span></button></div></section><section><div class="section-head"><div><span class="eyebrow">THE EVERYDAY FAVOURITES</span><h2>Trending in the mix</h2></div><a class="text-link" href="#discover">Discover more ${icon("chevron")}</a></div>${productGrid(products.filter((p) => ["plum-cleanser", "deconstruct-serum", "simple-moisturizer", "plum-lip"].includes(p.id)), state2)}</section>${state2.recent.length ? `<section><div class="section-head"><h2>Recently viewed</h2></div>${productGrid(state2.recent.slice(0, 4).map((id) => products.find((p) => p.id === id)), state2)}</section>` : ""}<section class="mix-note">${icon("leaf")}<h2>Skincare should fit you.<br><em>And your budget.</em></h2><p>No single-brand rules. No complicated routines.<br>Just the right mix, made for you.</p><a class="button secondary" href="#builder">Find My Mix</a></section></div>`;
  }
  var emptyState = (title, text2, href = "#discover", label = "Discover Products") => `<div class="empty-state">${icon("leaf")}<h2>${title}</h2><p>${text2}</p><a class="button primary" href="${href}" data-action="${href === "#discover" ? "clear-filters" : ""}">${label}</a></div>`;
  var selectOptions = (values, selected, all2 = "All") => `<option value="">${all2}</option>${values.map((v) => `<option value="${esc(v)}" ${String(selected) === String(v) ? "selected" : ""}>${esc(v)}</option>`).join("")}`;
  var chip = (text2) => `<span class="chip">${esc(text2)}</span>`;
  var pageTitle = (eyebrow, title, text2) => `<div class="page-heading"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${text2 ? `<p>${text2}</p>` : ""}</div>`;
  function renderDiscover(state2, ui2) {
    const f = ui2.filters, list = filterProducts(products, f);
    return `<div class="container interior-page">${pageTitle("YOUR NEXT SKIN FAVOURITE", "Find your perfect match.", "A little browsing. A better routine. Mix the brands you love.")}<div class="browse-layout"><aside class="filter-panel"><div class="panel-heading"><h3>${icon("filter")} Filters</h3><button class="link-button" data-action="clear-filters">Reset</button></div><form id="filters-form" class="filter-form"><label>Category<select name="category">${selectOptions(CATEGORIES, f.category, "Every step")}</select></label><label>Brand<select name="brand">${selectOptions(brands, f.brand, "All brands")}</select></label><div class="field-pair"><label>Min price<input name="min" type="number" min="0" max="5000" placeholder="₹0" value="${esc(f.min || "")}"></label><label>Max price<input name="max" type="number" min="0" max="5000" placeholder="Any" value="${esc(f.max || "")}"></label></div><label>Skin type<select name="skin">${selectOptions(SKIN_TYPES, f.skin, "All skin types")}</select></label><label>Skin concern<select name="concern">${selectOptions(CONCERNS, f.concern, "All concerns")}</select></label><label>Ingredient<select name="ingredient">${selectOptions(ingredients, f.ingredient, "Any ingredient")}</select></label><label>Minimum rating<select name="rating">${selectOptions([4, 4.5, 4.7], f.rating, "Any rating")}</select></label><label>Minimum discount<select name="discount">${selectOptions([20, 30, 40, 50], f.discount, "Any discount")}</select></label><div class="ethical-filters">${[["crueltyFree", "Cruelty-free"], ["vegan", "Vegan"], ["fragranceFree", "Fragrance-free"]].map(([key, label]) => `<label class="check-label"><input type="checkbox" name="${key}" ${f[key] ? "checked" : ""}>${label}</label>`).join("")}</div><button class="button primary full" type="submit">Apply Filters</button></form></aside><section class="browse-results"><div class="results-bar"><p><strong>${list.length}</strong> ${f.q ? `matches for “${esc(f.q)}”` : "skin favourites"}</p><label class="sort-control">Sort by <select id="sort-select" aria-label="Sort products">${[["", "Recommended"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["discount", "Biggest discount"], ["rating", "Top rated"]].map(([v, t]) => `<option value="${v}" ${f.sort === v ? "selected" : ""}>${t}</option>`).join("")}</select></label></div><div class="filter-chips">${["category", "brand", "skin", "concern", "ingredient", "q"].filter((k) => f[k]).map((k) => `<button class="chip" data-action="remove-filter" data-key="${k}">${esc(f[k])}${icon("close")}</button>`).join("")}${f.max ? chip("Under " + money(f.max)) : ""}</div>${list.length ? productGrid(list, state2) : emptyState("A fresh start?", "No products match all those filters. Try a wider budget or fewer filters.")}<p class="sample-note">24 sample products · Generic demo packaging · Prices are illustrative</p></section></div></div>`;
  }
  function skinForm(profile, id = "routine-form", buttonText = "Build My Routine", preferences) {
    return `<form id="${id}" class="skin-form"><div class="form-section"><span class="step-label">01</span><h3>Get to know your skin</h3><p>Pick the type that feels most like you.</p><div class="choice-grid">${SKIN_TYPES.map((s) => `<label class="choice-card"><input type="radio" name="skin" value="${s}" ${profile.skin === s ? "checked" : ""} required><span>${icon(s === "oily" ? "dropper" : s === "dry" ? "jar" : s === "sensitive" ? "leaf" : "sparkles")}<strong>${s[0].toUpperCase() + s.slice(1)}</strong></span></label>`).join("")}</div></div><div class="form-section"><span class="step-label">02</span><h3>A little focus</h3><p>Choose your main skin concerns.</p><div class="concern-choices">${CONCERNS.map((c) => `<label class="choice-pill"><input type="checkbox" name="concerns" value="${c}" ${profile.concerns.includes(c) ? "checked" : ""}><span>${c}</span></label>`).join("")}</div></div><div class="form-section"><span class="step-label">03</span><h3>A budget that feels right</h3><p>Your routine. Your comfort zone.</p><div class="budget-choices">${[500, 1e3, 1500, 2e3].map((b) => `<label class="choice-pill"><input type="radio" name="budget-choice" value="${b}" ${profile.budget === b ? "checked" : ""}><span>Under ${money(b)}</span></label>`).join("")}<label class="choice-pill"><input type="radio" name="budget-choice" value="custom" ${![500, 1e3, 1500, 2e3].includes(profile.budget) ? "checked" : ""}><span>Custom budget</span></label></div><label class="custom-budget">Your budget (₹)<input type="number" name="budget" min="100" max="100000" step="1" value="${profile.budget}" required></label></div>${preferences ? `<div class="form-section"><h3>Your preferences</h3><div class="concern-choices">${[["vegan", "Vegan"], ["fragranceFree", "Fragrance-free"], ["crueltyFree", "Cruelty-free"]].map(([k, l]) => `<label class="check-label"><input name="${k}" type="checkbox" ${preferences[k] ? "checked" : ""}>${l}</label>`).join("")}</div><p>Used as initial Discover filters. Product labels should always be checked.</p></div>` : ""}<button class="button primary full" type="submit">${icon("sparkles")}${buttonText}</button>${id === "routine-form" ? '<p class="sample-note">Budget AI prototype · On-device product matching, no external AI service.<br>Recommendations use sample compatibility tags. Follow each product’s label.</p>' : ""}</form>`;
  }
  function budgetPanel(state2, step) {
    const t = totals(state2.kit.map((id) => products.find((p) => p.id === id))), remaining = state2.profile.budget - t.total, percent = Math.min(100, t.total / state2.profile.budget * 100);
    return `<aside class="budget-panel"><span class="eyebrow">YOUR MIX, AT A GLANCE</span><h3>A happy skin budget.</h3><div class="budget-number"><span>Your budget</span><strong>${money(state2.profile.budget)}</strong></div><div class="budget-number"><span>Current total</span><strong>${money(t.total)}</strong></div><div class="progress-track ${remaining < 0 ? "over" : ""}" role="progressbar" aria-label="Budget used" aria-valuemin="0" aria-valuemax="${state2.profile.budget}" aria-valuenow="${Math.min(t.total, state2.profile.budget)}" aria-valuetext="${money(t.total)} of ${money(state2.profile.budget)}"><span style="width:${percent}%"></span></div><p class="budget-status ${remaining < 0 ? "danger" : ""}">${remaining >= 0 ? `${money(remaining)} left to play with` : `${money(-remaining)} over budget`}</p><div class="mini-savings">${icon("tag")}<div><strong>You save ${money(t.savings)}</strong><span>Compared with sample MRP</span></div></div><p class="muted small">${state2.kit.length} products · ${new Set(state2.kit.map((id) => products.find((p) => p.id === id).brand)).size} brands · one happy mix</p>${remaining < 0 ? '<button class="button secondary full" data-action="all-alternatives">Find Cheaper Alternatives</button>' : ""}${step === 2 ? `<button class="button primary full" data-action="builder-step" data-step="3" ${!state2.kit.length ? "disabled" : ""}>View My Routine</button>` : ""}${step === 3 ? `<button class="button primary full" data-action="kit-cart" ${!state2.kit.length ? "disabled" : ""}>${icon("bag")} Checkout My Kit</button>` : ""}</aside>`;
  }
  function kitRow(p, state2, reason) {
    return `<article class="kit-row"><a href="#product/${p.id}" class="mini-product-art">${productArt(p)}</a><div class="kit-row-info"><span class="brand-name">${p.brand} · ${p.category}</span><a class="product-name" href="#product/${p.id}">${p.name}</a>${reason ? `<p class="recommend-reason">${icon("sparkles")}${esc(reason)}</p>` : ""}<div class="kit-row-actions"><button class="link-button" data-action="alternatives" data-id="${p.id}">${icon("swap")} Find a cheaper alternative</button><button class="link-button" data-action="replace-category" data-category="${p.category}">Replace</button></div></div><div class="kit-row-price"><strong>${money(p.price)}</strong><s>${money(p.mrp)}</s><button class="icon-button" data-action="remove-kit" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from kit">${icon("close")}</button></div></article>`;
  }
  function kitNotice(state2) {
    const selected = state2.kit.map((id) => products.find((p) => p.id === id));
    const required = ["Cleanser", "Moisturizer", "Sunscreen"];
    const missing = required.filter((cat) => !selected.some((p) => p.category === cat));
    if (!missing.length) return "";
    const minimum = required.reduce((sum, cat) => sum + Math.min(...products.filter((p) => p.category === cat && p.skin.includes(state2.profile.skin)).map((p) => p.price)), 0);
    return `<div class="inline-notice warning">${state2.profile.budget < minimum ? "Your budget cannot cover all three essentials." : "Your kit is missing essential steps."} Missing: ${missing.join(", ")}. The lowest sample essentials total for your skin is ${money(minimum)}. Add the missing steps or adjust your budget.</div>`;
  }
  function renderBuilder(state2, ui2) {
    const step = ui2.builderStep, list = state2.kit.map((id) => products.find((p) => p.id === id));
    let content;
    if (step === 1) content = `<div class="panel profile-builder"><div class="panel-heading"><h2>Let’s find your mix.</h2><span class="chip lavender">${icon("sparkles")} Budget AI</span></div>${skinForm(state2.profile)}</div>`;
    else if (step === 2) content = `<div class="panel"><div class="panel-heading"><div><span class="eyebrow">CHOSEN WITH YOUR SKIN IN MIND</span><h2>Your personalized routine</h2></div><button class="link-button" data-action="builder-step" data-step="1">Edit skin profile</button></div><div class="filter-chips">${chip(state2.profile.skin + " skin")}${state2.profile.concerns.map(chip).join("")}${chip(money(state2.profile.budget) + " budget")}</div>${kitNotice(state2)}${list.length ? list.map((p) => kitRow(p, state2, ui2.reasons[p.id])).join("") : emptyState("Start your own mix.", "Add a cleanser, moisturizer and sunscreen below.", "#builder", "Build My Routine")}</div><section id="builder-products" class="customize-section"><div class="section-head"><div><span class="eyebrow">A MIX THAT IS ALL YOURS</span><h2>Customize your kit</h2><p>Choose one product per step. A new pick replaces the existing one.</p></div></div><div class="category-tabs">${CATEGORIES.map((c) => `<button class="pill-tab ${ui2.builderCategory === c ? "active" : ""}" data-action="builder-category" data-category="${c}">${icon(categoryIcons[c])}${c}</button>`).join("")}</div>${productGrid(products.filter((p) => p.category === ui2.builderCategory), state2)}</section>`;
    else content = renderKitSummary(state2);
    return `<div class="container interior-page">${pageTitle("YOUR SKIN. YOUR BRANDS. YOUR BUDGET.", "A routine as unique as you.", "Build a little self-care that fits your everyday life.")}<div class="builder-stepper">${[["Your skin", "1"], ["Your mix", "2"], ["Your routine", "3"]].map(([l, s]) => `<button class="${step === Number(s) ? "current" : step > Number(s) ? "done" : ""}" data-action="builder-step" data-step="${s}"><span>${step > Number(s) ? icon("check") : s}</span>${l}</button>`).join("")}</div><div class="builder-layout"><div>${content}</div>${budgetPanel(state2, step)}</div></div>`;
  }
  function renderKitSummary(state2) {
    const list = state2.kit.map((id) => products.find((p) => p.id === id)), sections = routineSections(list), t = totals(list);
    if (!list.length) return emptyState("Your mix is waiting.", "Start with your skin profile or add your favourite products.", "#builder", "Build My Kit");
    const routine = (time, items) => `<section class="routine-card"><h3>${icon(time === "Morning" ? "sun" : "moon")} ${time} Routine</h3><ol>${items.map((p) => `<li><span class="routine-step"><strong>${p.category}</strong><span>${p.brand} · ${p.name}</span></span><button class="link-button" data-action="remove-kit" data-id="${p.id}" aria-label="Remove ${esc(p.name)}">${icon("close")}</button></li>`).join("")}</ol>${time === "Night" ? '<p class="sample-note">Face masks are occasional steps; follow the label.</p>' : ""}</section>`;
    return `<div class="panel"><span class="eyebrow">MY CUSTOM KIT</span><div class="panel-heading"><h2>Your everyday glow.</h2><button class="link-button" data-action="builder-step" data-step="2">Customize</button></div>${kitNotice(state2)}<div class="routine-grid">${routine("Morning", sections.morning)}${routine("Night", sections.night)}</div><div class="savings-score">${icon("sparkles")}<div><span>SAME CARE. A HAPPIER BUDGET.</span><h2>You saved ${money(t.savings)}</h2><p>Original value ${money(t.original)} · Your price ${money(t.total)} · ${t.percent}% savings</p></div><strong>${t.percent}%<small>SAVINGS SCORE</small></strong></div><div class="summary-actions"><button class="button secondary" data-action="save-kit">${icon("bookmark")} Save Kit</button><button class="button secondary" data-action="share-kit">${icon("share")} Share Kit</button><button class="button secondary" data-action="all-alternatives">${icon("swap")} Find Cheaper Alternatives</button></div><p class="sample-note">Totals count each selected product once, even if used morning and night.</p></div>`;
  }
  function renderProduct(p, state2) {
    if (!p) return `<div class="container interior-page">${emptyState("That product is not in this mix.", "Explore the sample collection to find something new.")}</div>`;
    const cheaper = alternatives(p, products, state2.profile.skin);
    return `<div class="container interior-page"><a class="back-link" href="#discover">${icon("back")} Back to Discover</a><div class="product-detail"><div class="detail-image"><div class="large-product-art">${productArt(p)}</div><span class="chip image-note">Generic sample packaging</span></div><div class="detail-content"><span class="eyebrow">${p.brand} · ${p.category}</span><h1>${p.name}</h1><div class="detail-rating"><span class="rating">${icon("star")} ${p.rating}</span><a href="#product/${p.id}?section=reviews">${p.reviews} sample reviews</a><span class="chip">Sample product</span></div><p>${p.description}</p><div class="detail-pricing"><strong>${money(p.price)}</strong><s>MRP ${money(p.mrp)}</s><span class="chip green">${discount(p)}% OFF</span></div><p class="deal-saving">You save ${money(p.mrp - p.price)} <span>· ${unitPrice(p)} / ${p.unit} · ${p.size} ${p.unit}</span></p><div class="detail-actions"><button class="button primary" data-action="add-kit" data-id="${p.id}">${icon("plus")}${state2.kit.includes(p.id) ? "Added to Kit" : "Add to Kit"}</button><button class="button secondary" data-action="add-cart" data-id="${p.id}">${icon("bag")} Add to Cart</button><button class="icon-button ${state2.wishlist.includes(p.id) ? "is-saved" : ""}" data-action="wishlist" data-id="${p.id}" aria-label="${state2.wishlist.includes(p.id) ? "Remove from" : "Add to"} wishlist">${icon("heart")}</button></div><button class="link-button alert-link" data-action="price-alert" data-id="${p.id}">${icon("bell")} ${state2.alerts.some((a) => a.id === p.id) ? "Edit your price alert" : "Set a price drop alert"}</button><div class="detail-section"><h3>The good inside</h3><div class="filter-chips">${p.ingredients.map(chip).join("")}</div><p class="small muted">Key ingredient information: ${p.ingredients.join(", ")}. This is illustrative, not a verified full ingredient list.</p></div><div class="detail-section"><h3>Your skin match</h3><div class="filter-chips">${p.skin.map((s) => chip(s + " skin")).join("")}</div><div class="filter-chips">${p.concerns.map(chip).join("")}</div><div class="ethical-badges">${p.vegan ? `<span>${icon("leaf")} Vegan</span>` : ""}${p.crueltyFree ? `<span>${icon("heart")} Cruelty-free</span>` : ""}${p.fragranceFree ? `<span>${icon("shield")} Fragrance-free</span>` : ""}</div></div></div></div><div class="product-info-grid"><section class="panel"><span class="eyebrow">A BETTER DEAL, IN ONE PLACE</span><h2>Compare seller prices</h2><p class="muted small">Illustrative offers for the same sample product.</p><div class="seller-list">${p.sellers.map((s, i) => `<div class="seller-row ${i === 0 ? "best-seller" : ""}"><div><strong>${s.name}</strong>${i === 0 ? '<span class="chip green">Best Price</span>' : ""}<small>Sample offer · delivery shown at checkout</small></div><strong>${money(s.price)}</strong><button class="button ${i === 0 ? "primary" : "secondary"}" data-action="seller-cart" data-id="${p.id}" data-seller="${i}">${i === 0 ? "Add to Cart" : "View Offer"}</button></div>`).join("")}</div></section><section class="panel"><h3>Benefits</h3><ul class="benefit-list">${p.benefits.map((b) => `<li>${icon("check")}${b}</li>`).join("")}</ul><h3>How to use</h3><p class="muted small">${p.use}</p><p class="sample-note">Patch-test new products and check the actual manufacturer’s label.</p></section></div><section class="detail-related"><div class="section-head"><div><span class="eyebrow">SAME STEP, LESS SPEND</span><h2>Cheaper alternatives</h2></div>${chip(state2.profile.skin + " skin")}</div>${cheaper.length ? productGrid(cheaper, state2) : `<div class="inline-notice">This is already the lowest-priced sample match for ${state2.profile.skin} skin.</div>`}</section><section class="detail-related"><div class="section-head"><h2>More for your mix</h2></div>${productGrid(products.filter((q) => q.category === p.category && q.id !== p.id), state2)}</section><section class="panel detail-related" id="reviews"><h2>A little love for this pick</h2><p class="sample-note">Illustrative reviews, not real customer submissions.</p><div class="review-grid"><blockquote><span>★★★★★</span><p>“A simple addition to my everyday routine.”</p><cite>Sample review · Riya</cite></blockquote><blockquote><span>★★★★☆</span><p>“Easy to fit into my skin budget.”</p><cite>Sample review · Ananya</cite></blockquote></div></section><div class="mobile-product-action"><strong>${money(p.price)}</strong><button class="button primary" data-action="add-kit" data-id="${p.id}">${icon("plus")} Add to Kit</button></div></div>`;
  }
  function renderDeals(state2, ui2) {
    const tab = ui2.dealTab || "flash";
    let list = products.filter((p) => discount(p) >= 30).sort((a, b) => discount(b) - discount(a));
    if (tab === "500") list = products.filter((p) => p.price < 500).sort((a, b) => a.price - b.price);
    if (tab === "1000") list = products.filter((p) => p.price < 1e3).sort((a, b) => discount(b) - discount(a));
    if (tab === "flash") list = list.slice(0, 8);
    return `<div class="container interior-page">${pageTitle("A LITTLE EXTRA GLOW FOR LESS", "Good skin. Great finds.", "Your favourite care, with room left in your budget.")}<div class="deals-hero"><div>${icon("tag")}<span class="eyebrow">THE SKINMIX SAVINGS EDIT</span><h2>Good things come<br>in <em>better-priced mixes.</em></h2><p>Sample discounts up to 50%. A little care goes a long way.</p></div><div class="coupon-ticket"><span>YOUR FIRST MIX, FOR LESS</span><strong>10% OFF</strong><p>Up to ₹150 off your sample cart</p><button class="coupon-code" data-action="copy-coupon">SKIN10 ${icon("bookmark")}</button><small>Demo coupon · excludes delivery</small></div></div><div class="deal-tabs">${[["flash", "Flash Deals"], ["discount", "Highest Discounts"], ["500", "Under ₹500"], ["1000", "Under ₹1,000"], ["bundle", "Buy More Save More"], ["limited", "Limited-Time Offers"]].map(([id, label]) => `<button class="pill-tab ${tab === id ? "active" : ""}" data-action="deal-tab" data-tab="${id}">${label}</button>`).join("")}</div>${tab === "bundle" ? `<div class="budget-banner"><div><span class="eyebrow">THREE STEPS. ONE MIX.</span><h2>Your essentials, together.</h2><p>Build a multi-brand kit and use SKIN10 at demo checkout.</p></div><button class="button primary" data-action="budget-kit" data-budget="999">Build a Budget Bundle</button></div>` : tab === "limited" ? '<div class="inline-notice">Limited-time offer preview: SKIN10 takes 10% off, up to ₹150. This sample coupon has no live expiry or stock feed.</div>' : ""}<div class="section-head"><h2>${tab === "flash" ? "Flash deal picks" : tab === "500" ? "Little treats under ₹500" : tab === "1000" ? "Care under ₹1,000" : "More glow, less spend"}</h2><span class="small muted">${list.length} sample deals</span></div>${productGrid(list, state2)}</div>`;
  }
  function renderWishlist(state2) {
    const list = state2.wishlist.map((id) => products.find((p) => p.id === id));
    return `<div class="container interior-page">${pageTitle("SAVE A LITTLE LOVE", "Your wishlist.", "Your favourites, ready whenever you are.")}${list.length ? productGrid(list, state2) : emptyState("Your next favourite is out there.", "Tap the heart on a product to keep it here.")}</div>`;
  }
  function renderProfile(state2) {
    const alerts = state2.alerts.map((a) => ({ ...a, p: products.find((p) => p.id === a.id), status: alertStatus(a, products.find((p) => p.id === a.id)) }));
    return `<div class="container interior-page">${pageTitle("A LITTLE SPACE FOR YOU", "Your skin, your story.", "Keep your profile, favourite mixes and savings in one place.")}<div class="profile-layout"><div><section class="panel"><div class="panel-heading"><h2>My skin profile</h2>${chip("Saved on this device")}</div>${skinForm(state2.profile, "profile-form", "Save Skin Profile", state2.preferences)}</section><section class="panel profile-section"><h2>Saved kits</h2><p class="muted small">Keep a different mix for every kind of day.</p>${state2.savedKits.length ? `<div class="saved-kit-list">${state2.savedKits.map((k) => {
      const t = totals(k.ids.map((id) => products.find((p) => p.id === id)));
      return `<article class="saved-kit"><span>${icon("bookmark")}</span><div><h3>${esc(k.name)}</h3><p>${k.ids.length} products · ${money(t.total)} · saved ${money(t.savings)}</p></div><button class="button secondary" data-action="load-kit" data-id="${esc(k.id)}">Load Kit</button><button class="icon-button" data-action="delete-saved" data-id="${esc(k.id)}" aria-label="Delete saved ${esc(k.name)}">${icon("close")}</button></article>`;
    }).join("")}</div>` : emptyState("Keep your favourite mix.", "Build a kit and choose Save Kit to keep it here.", "#builder", "Build My Kit")}</section><section class="panel profile-section"><h2>My demo orders</h2>${state2.orders.length ? state2.orders.map((o) => `<div class="order-row"><div><strong>${esc(o.id)}</strong><p>${esc(o.date)} · ${o.items.reduce((n, i) => n + i.qty, 0)} items</p><span class="chip green">Demo order · no payment taken</span></div><strong>${money(o.total)}</strong></div>`).join("") : '<p class="muted small">Your completed demo checkouts will appear here.</p>'}</section></div><aside><section class="panel profile-card"><span class="profile-avatar">${icon("user")}</span><h2>Hello, glow getter.</h2><p>${state2.profile.skin[0].toUpperCase() + state2.profile.skin.slice(1)} skin · ${money(state2.profile.budget)} budget</p><div class="profile-links"><a href="#wishlist">${icon("heart")} Wishlist <strong>${state2.wishlist.length}</strong></a><a href="#cart">${icon("bag")} Shopping bag <strong>${state2.cart.reduce((n, i) => n + i.qty, 0)}</strong></a><a href="#builder">${icon("sparkles")} My custom kit <strong>${state2.kit.length}</strong></a></div></section><section class="panel profile-section"><div class="panel-heading"><h3>${icon("bell")} Price alerts</h3></div><p class="small muted">Device-local alerts checked against sample prices when you open this app. No emails, push notifications or live tracking.</p>${alerts.length ? alerts.map(({ p, target, status }) => `<div class="alert-row"><a href="#product/${p.id}">${p.name}</a><p>Target ${money(target)} · now ${money(p.price)}</p><span class="chip ${Object.values(status).some(Boolean) ? "green" : ""}">${status.targetReached ? "Target reached" : status.priceDropped ? "Sample price dropped" : status.discountIncreased ? "A bigger sample discount" : "Waiting for a lower sample price"}</span><div><button class="link-button" data-action="price-alert" data-id="${p.id}">Edit target</button><button class="link-button" data-action="remove-alert" data-id="${p.id}">Remove</button></div></div>`).join("") : '<p class="sample-note">Open a product and choose Set a price drop alert.</p>'}</section></aside></div>${state2.recent.length ? `<section class="detail-related"><div class="section-head"><h2>Recently viewed</h2></div>${productGrid(state2.recent.slice(0, 4).map((id) => products.find((p) => p.id === id)), state2)}</section>` : ""}</div>`;
  }
  function cartSummary(state2, checkout = false) {
    const t = cartTotals(state2.cart, products, state2.coupon);
    return `<aside class="panel cart-summary"><h3>A little price check</h3><dl><div><dt>Original total</dt><dd>${money(t.original)}</dd></div><div><dt>Product discounts</dt><dd class="green-text">− ${money(t.productSavings)}</dd></div><div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>${t.couponDiscount ? `<div><dt>SKIN10 discount</dt><dd class="green-text">− ${money(t.couponDiscount)}</dd></div>` : ""}<div><dt>Delivery</dt><dd>${t.delivery ? money(t.delivery) : "FREE"}</dd></div><div class="final-total"><dt>Final total</dt><dd>${money(t.total)}</dd></div></dl><div class="mini-savings">${icon("tag")}<strong>You saved ${money(t.savings)}</strong></div>${!checkout ? `<form id="coupon-form" class="coupon-form"><label for="coupon-input">Have a little saving code?</label><div><input id="coupon-input" name="coupon" placeholder="Try SKIN10" value="${esc(state2.coupon)}"><button class="button secondary" type="submit">Apply</button></div>${state2.coupon ? '<button class="link-button" type="button" data-action="remove-coupon">Remove coupon</button>' : "<small>SKIN10: 10% off, up to ₹150</small>"}</form><a class="button primary full" href="#checkout">Continue to Checkout</a>` : ""}<p class="sample-note">Free sample delivery on subtotals of ₹499+.<br>No payment will be taken.</p></aside>`;
  }
  function renderCart(state2) {
    if (!state2.cart.length) return `<div class="container interior-page">${pageTitle("YOUR EVERYDAY LITTLE TREATS", "Your shopping bag.", "All your favourite care, in one place.")}${emptyState("Your bag is feeling light.", "Add a product, or send your entire custom kit to your bag.", "#discover", "Explore Products")}</div>`;
    return `<div class="container interior-page">${pageTitle("YOUR EVERYDAY LITTLE TREATS", "Your shopping bag.", "All your favourite care, in one place.")}<div class="cart-layout"><section class="panel cart-items">${state2.cart.map((i) => {
      const p = products.find((p2) => p2.id === i.id);
      return `<article class="cart-row"><a class="mini-product-art" href="#product/${p.id}">${productArt(p)}</a><div class="cart-row-info"><span class="brand-name">${p.brand}</span><a href="#product/${p.id}" class="product-name">${p.name}</a><p class="small muted">${p.size} ${p.unit} · ${money(p.price)} each</p><div class="quantity-control"><button data-action="quantity" data-id="${p.id}" data-delta="-1" aria-label="Decrease quantity of ${esc(p.name)}" ${i.qty === 1 ? "disabled" : ""}>${icon("minus")}</button><span>${i.qty}</span><button data-action="quantity" data-id="${p.id}" data-delta="1" aria-label="Increase quantity of ${esc(p.name)}" ${i.qty >= 99 ? "disabled" : ""}>${icon("plus")}</button></div></div><div class="cart-row-price"><strong>${money(p.price * i.qty)}</strong><s>${money(p.mrp * i.qty)}</s><span class="green-text small">Save ${money((p.mrp - p.price) * i.qty)}</span><button class="link-button" data-action="remove-cart" data-id="${p.id}">Remove</button></div></article>`;
    }).join("")}<div class="delivery-note">${icon("truck")}<div><strong>Estimated sample delivery: 3–5 days</strong><p>This is a shopping preview. No real delivery is arranged.</p></div></div><a class="text-link" href="#discover">Keep discovering ${icon("chevron")}</a></section>${cartSummary(state2)}</div></div>`;
  }
  function renderCheckout(state2) {
    if (!state2.cart.length) return `<div class="container interior-page">${emptyState("Add a little care first.", "Your shopping bag is empty.", "#discover", "Explore Products")}</div>`;
    return `<div class="container interior-page">${pageTitle("ONE LAST LITTLE STEP", "Make this mix yours.", "Try the checkout experience. No payment or purchase will be made.")}<div class="cart-layout"><section class="panel"><div class="inline-notice">Demo checkout · Please use sample details. Your delivery details are not sent or saved.</div><form id="checkout-form" class="checkout-form"><h2>Delivery details</h2><div class="field-pair"><label>Full name<input name="name" autocomplete="name" minlength="2" maxlength="80" required placeholder="Your name"></label><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label></div><div class="field-pair"><label>Phone number<input name="phone" type="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required placeholder="10-digit mobile number" title="Enter a 10-digit number"></label><label>PIN code<input name="pin" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required placeholder="6-digit PIN" title="Enter a 6-digit PIN code"></label></div><label>Delivery address<textarea name="address" minlength="8" maxlength="300" required rows="3" placeholder="House, street, city and state"></textarea></label><div class="payment-preview">${icon("shield")}<div><strong>Demo payment</strong><p>No card details needed. No money is charged.</p></div></div><button class="button primary full" type="submit">Complete Demo Order · ${money(cartTotals(state2.cart, products, state2.coupon).total)}</button></form></section>${cartSummary(state2, true)}</div></div>`;
  }
  function renderOrderSuccess(order) {
    return `<div class="container interior-page"><div class="order-success panel"><span>${icon("check")}</span><div class="eyebrow">A LITTLE CARE, ALL MIXED UP</div><h1>Your demo mix is complete.</h1><p>No payment was taken and no real order was placed.</p><div class="success-receipt"><strong>${esc(order.id)}</strong><p>${esc(order.date)}</p><strong>${money(order.total)}</strong><p>${order.items.reduce((n, i) => n + i.qty, 0)} sample items · estimated demo delivery 3–5 days</p></div><div class="hero-buttons"><a class="button primary" href="#profile">View Demo Orders</a><a class="button secondary" href="#home">Back to Home</a></div></div></div>`;
  }

  // src/skin/storage.js
  var SKIN_KEY = "skinmix-skin-v1";
  function loadSkin() {
    try {
      return normalizeSkinState(JSON.parse(localStorage.getItem(SKIN_KEY) || "{}"), products);
    } catch {
      return normalizeSkinState({}, products);
    }
  }
  function saveSkin(state2) {
    try {
      const s = state2.settings.saveHistory ? state2 : { settings: state2.settings };
      localStorage.setItem(SKIN_KEY, JSON.stringify(s));
      return true;
    } catch {
      return false;
    }
  }
  var connection;
  function database() {
    if (!connection) connection = new Promise((resolve, reject) => {
      const request = indexedDB.open("skinmix-private-photos", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("photos");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Photo storage is unavailable in this browser."));
      request.onblocked = () => reject(new Error("Close other SkinMix tabs and try again."));
    }).catch((e) => {
      connection = null;
      throw e;
    });
    return connection;
  }
  async function transaction(mode, action) {
    const db = await database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("photos", mode), request = action(tx.objectStore("photos"));
      let value;
      request.onsuccess = () => {
        value = request.result;
      };
      tx.oncomplete = () => resolve(value);
      tx.onerror = () => reject(tx.error || new Error("Photo storage failed."));
      tx.onabort = () => reject(tx.error || new Error("Photo storage failed."));
    });
  }
  var putPhoto = (id, data) => transaction("readwrite", (s) => s.put(data, id));
  var getPhoto = async (id) => {
    const data = await transaction("readonly", (s) => s.get(id));
    return typeof data === "string" && data.length < 4e6 && /^data:image\/jpeg;base64,[a-zA-Z0-9+/=]+$/.test(data) ? data : null;
  };
  var deletePhotos = () => transaction("readwrite", (s) => s.clear());
  var deletePhoto = (id) => transaction("readwrite", (s) => s.delete(id));

  // src/skin/media.js
  async function preparePhoto(file) {
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP photo.");
    if (file.size > 8 * 1024 * 1024) throw new Error("Choose a photo smaller than 8 MB.");
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("This photo could not be opened. Try another image."));
        image.src = url;
      });
      if (!img.naturalWidth || !img.naturalHeight || img.naturalWidth * img.naturalHeight > 5e7) throw new Error("This photo is too large to preview. Resize it and try again.");
      const scale = Math.min(1, 960 / Math.max(img.naturalWidth, img.naturalHeight)), canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let light = 0;
      for (let i = 0; i < pixels.length; i += 64) light += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      light /= Math.ceil(pixels.length / 64);
      return { dataUrl: canvas.toDataURL("image/jpeg", 0.82), lighting: light < 65 ? "The image looks dark. Try indirect daylight." : light > 225 ? "The image looks very bright. Avoid direct light." : "Lighting preview ready. Keep the same light for future photos.", width: canvas.width, height: canvas.height };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  function cameraBlob(video) {
    return new Promise((resolve, reject) => {
      if (!video.videoWidth) return reject(new Error("The camera is still loading. Try again in a moment."));
      const c = document.createElement("canvas"), scale = Math.min(1, 960 / video.videoWidth);
      c.width = Math.round(video.videoWidth * scale);
      c.height = Math.round(video.videoHeight * scale);
      c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
      c.toBlob((b) => b ? resolve(b) : reject(new Error("Could not capture the photo.")), "image/jpeg", 0.85);
    });
  }

  // src/skin/controller.js
  function createSkinAnalyzer(bridge) {
    let state2 = loadSkin(), stream = null, epoch = 0, photoEpoch = 0, hydrating = false;
    const ui2 = { stage: "start", photo: null, images: {}, scanning: false, message: "", optimized: null, before: "", after: "" };
    const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    const route = () => location.hash.slice(1).split("?")[0];
    const current = () => route().startsWith("analyzer");
    const save2 = () => {
      const stored = saveSkin(state2);
      if (!stored) bridge.toast("Browser storage is unavailable. Your skin diary lasts only for this session.");
      return stored;
    };
    const stopCamera = () => {
      epoch++;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    };
    const recommendation = () => recommendSkinRoutine(products, state2.profile, state2.responses);
    const stage = (r) => bridge.stageRoutine(r.products, state2.profile, r.reasons);
    function refresh() {
      if (current()) bridge.render();
    }
    async function hydrate() {
      if (hydrating) return;
      const records = state2.history.filter((r) => r.photoId && !(r.photoId in ui2.images));
      if (!records.length) return;
      hydrating = true;
      const token = photoEpoch;
      try {
        for (const r of records) {
          const data = await getPhoto(r.photoId);
          if (token !== photoEpoch) break;
          ui2.images[r.photoId] = data || null;
        }
      } catch {
        for (const r of records) ui2.images[r.photoId] = null;
        bridge.toast("Saved photos cannot be read here. You can still use your profile and routine.");
      } finally {
        hydrating = false;
        if (token === photoEpoch && current() && route().includes("journey")) refresh();
      }
    }
    async function clearImages() {
      photoEpoch++;
      stopCamera();
      ui2.scanning = false;
      ui2.photo = null;
      ui2.images = {};
      ui2.before = "";
      ui2.after = "";
      state2.history.forEach((r) => r.photoId = null);
      if (state2.latest) state2.latest.photoId = null;
      state2.settings.photoCleanupPending = true;
      save2();
      try {
        await deletePhotos();
        state2.settings.photoCleanupPending = false;
        save2();
        return true;
      } catch {
        bridge.toast("Saved images could not be cleared. Try again, or clear this site’s browser storage.");
        return false;
      }
    }
    function clearHistory() {
      state2 = normalizeSkinState({ settings: state2.settings }, products);
      ui2.optimized = null;
      save2();
    }
    async function preview(file) {
      const token = ++photoEpoch;
      ui2.scanning = false;
      ui2.message = "Preparing your private photo…";
      refresh();
      try {
        const result = await preparePhoto(file);
        if (token !== photoEpoch || !state2.settings.consent) return;
        ui2.photo = result;
        ui2.message = result.lighting;
        refresh();
      } catch (e) {
        if (token === photoEpoch) {
          ui2.message = e.message;
          refresh();
          bridge.toast(e.message);
        }
      }
    }
    function todaySteps() {
      const schedule = scheduleFor(bridge.getShop().kit, products, state2.responses);
      return Object.entries(schedule).flatMap(([time, ps]) => ps.map((p) => time + ":" + p.id));
    }
    function responseFields() {
      const select = document.querySelector("#skin-response-product");
      if (!select) return;
      const response = state2.responses[select.value];
      document.querySelector("#skin-response-status").value = response?.status || "well";
      document.querySelector("#skin-response-note").value = response?.note || "";
    }
    async function camera() {
      if (!state2.settings.consent) {
        bridge.toast("Allow local photo processing first.");
        return;
      }
      stopCamera();
      const token = epoch;
      if (!navigator.mediaDevices?.getUserMedia) {
        bridge.toast("Camera access is unavailable here. Upload a photo, or open SkinMix on localhost.");
        return;
      }
      bridge.openDialog("Your private selfie", `<div class="skin-camera"><video id="skin-camera-video" autoplay playsinline muted></video><p id="skin-camera-status" role="status">Waiting for camera permission…</p><p class="small muted">Face forward in indirect light. The camera stops when you close this window.</p><div class="skin-upload-actions"><button class="button primary" data-skin-action="capture" disabled>Capture Photo</button><button class="button secondary" data-skin-action="cancel-camera">Cancel</button></div></div>`);
      try {
        const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 960 } }, audio: false });
        const video = document.querySelector("#skin-camera-video");
        if (token !== epoch || !state2.settings.consent || !current() || !video || !document.querySelector("#dialog").open) {
          next.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = next;
        video.srcObject = stream;
        video.onloadeddata = () => {
          if (token === epoch) {
            document.querySelector('[data-skin-action="capture"]')?.removeAttribute("disabled");
            const message = document.querySelector("#skin-camera-status");
            if (message) message.textContent = "Camera ready. Only a captured photo is used.";
          }
        };
      } catch (e) {
        if (token === epoch) {
          const message = document.querySelector("#skin-camera-status");
          if (message) message.textContent = "Camera access was denied or is unavailable. Please upload a photo instead.";
          bridge.toast("Camera unavailable. You can upload a photo instead.");
        }
      }
    }
    function compareOptions(productId) {
      const p = products.find((p2) => p2.id === productId);
      if (!p) return;
      const candidates = eligibleProducts(products, state2.profile, state2.responses).filter((q) => q.category === p.category && (state2.profile.skin === "not-sure" || q.skin.includes(state2.profile.skin))).sort((a, b) => a.price - b.price), rec = recommendation().products.find((q) => q.category === p.category), choices = [["Budget", candidates[0]], ["Recommended", rec || candidates[Math.floor(candidates.length / 2)]], ["Premium price", candidates.at(-1)]], base = totals(products.filter((q) => bridge.getShop().kit.includes(q.id) && q.category !== p.category)).total;
      bridge.openDialog("Find your kind of care.", `<p class="small muted">Sample ${esc(p.category.toLowerCase())} options, matched to your preferences. Higher price does not establish better results. Current pick: ${money(p.price)}.</p><div class="skin-option-grid">${choices.filter(([, q]) => q).map(([label, q]) => `<article class="skin-option"><span class="skin-pill">${label}</span>${productArt(q)}<span class="brand-name">${q.brand}</span><h3>${q.name}</h3><p class="small">${esc(q.ingredients.join(", "))} · ★ ${q.rating} sample</p><p class="small">${q.size} ${q.unit} · ${(q.price / q.size).toFixed(2)} INR/${q.unit}</p><p class="small">Catalog skin tags: ${esc(q.skin.join(", "))}</p><p>${money(q.price)} <s>${money(q.mrp)}</s></p><p class="small ${q.price < p.price ? "green-text" : ""}">${q.price < p.price ? "Save " + money(p.price - q.price) + " more" : q.price === p.price ? "Same price as your pick" : money(q.price - p.price) + " more than your pick"}</p><p class="small">Kit total: ${money(base + q.price)}</p><button class="button primary" data-skin-action="choose" data-id="${q.id}" ${base + q.price > state2.profile.budget ? "disabled" : ""}>${base + q.price > state2.profile.budget ? "Over budget" : "Choose This Product"}</button><a class="text-link" href="#product/${q.id}" data-action="close-dialog">Full product details</a></article>`).join("")}</div>`);
    }
    const reminders = /* @__PURE__ */ new Set();
    function remind() {
      const date = localDay(), d = /* @__PURE__ */ new Date(), time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      for (const period of ["Morning", "Night"]) {
        const key = date + period;
        if (state2.settings["reminder" + period] && time === state2.settings[period.toLowerCase() + "Time"] && !reminders.has(key)) {
          reminders.add(key);
          bridge.toast(`A little care for you: your ${period.toLowerCase()} routine is ready.`);
        }
      }
    }
    const reminderTimer = setInterval(remind, 15e3);
    window.addEventListener("pagehide", () => {
      stopCamera();
      clearInterval(reminderTimer);
    });
    document.querySelector("#dialog").addEventListener("close", stopCamera);
    window.addEventListener("storage", (e) => {
      if (e.key !== SKIN_KEY && e.key !== null) return;
      photoEpoch++;
      stopCamera();
      state2 = loadSkin();
      ui2.images = {};
      ui2.photo = null;
      ui2.scanning = false;
      ui2.before = "";
      ui2.after = "";
      ui2.message = "Privacy or diary data changed in another tab.";
      refresh();
    });
    return {
      render(path) {
        const tab = path.split("/")[1] || "start";
        if (tab === "journey") void hydrate();
        const r = recommendation();
        const views = { start: () => startView(state2, ui2), snapshot: () => snapshotView(state2, ui2, r), routine: () => routineView(state2, ui2, r, bridge.getShop()), journey: () => journeyView(state2, ui2), privacy: () => privacyView(state2), learn: learnView };
        const html = skinShell(path, (state2.settings.photoCleanupPending ? '<div class="skin-warning" role="status">Saved-image cleanup is incomplete. Retry Delete All Images in Privacy, or clear this site’s browser storage.</div>' : "") + (views[tab] || views.start)());
        if (tab === "routine") setTimeout(responseFields, 0);
        return html;
      },
      leave(path) {
        stopCamera();
        if (path !== "analyzer") {
          photoEpoch++;
          ui2.scanning = false;
        }
        if (!path.startsWith("analyzer")) {
          ui2.photo = null;
          ui2.message = "";
        }
      },
      input(target) {
        if (target.id !== "skin-compare-slider") return false;
        const value = Number(target.value);
        document.querySelector("#skin-compare-before").style.clipPath = `inset(0 ${100 - value}% 0 0)`;
        document.querySelector("#skin-compare-line").style.left = value + "%";
        return true;
      },
      async change(target) {
        if (target.id === "skin-photo-input") {
          if (!state2.settings.consent) {
            bridge.toast("Allow local photo processing first.");
            return true;
          }
          if (target.files[0]) await preview(target.files[0]);
          return true;
        }
        if (target.name === "skin-consent") {
          state2.settings.consent = target.checked;
          if (!target.checked) {
            state2.settings.storePhotos = false;
            await clearImages();
          }
          save2();
          refresh();
          return true;
        }
        if (target.name === "skin-store-photos") {
          if (target.checked && (!state2.settings.consent || !state2.settings.saveHistory)) {
            bridge.toast("Enable local processing and history saving before keeping photos.");
            refresh();
            return true;
          }
          state2.settings.storePhotos = target.checked;
          if (!target.checked) await clearImages();
          save2();
          return true;
        }
        if (target.name === "budget-range") {
          if (target.value !== "custom") target.form.elements.budget.value = target.value;
          return true;
        }
        if (target.dataset.skinStep) {
          const steps = todaySteps();
          if (!steps.includes(target.dataset.skinStep)) return true;
          let day = state2.days.find((d) => d.date === localDay());
          if (!day) {
            day = { date: localDay(), steps, done: [] };
            state2.days.push(day);
          } else day.steps = [.../* @__PURE__ */ new Set([...day.steps, ...steps])];
          day.done = day.done.filter((k) => k !== target.dataset.skinStep);
          if (target.checked) day.done.push(target.dataset.skinStep);
          save2();
          refresh();
          return true;
        }
        if (target.id === "skin-before" || target.id === "skin-after") {
          ui2[target.id === "skin-before" ? "before" : "after"] = target.value;
          refresh();
          return true;
        }
        if (target.id === "skin-response-product") {
          responseFields();
          return true;
        }
        return false;
      },
      async click(button) {
        if (!button) return false;
        const action = button.dataset.skinAction;
        if (!action) return false;
        if (action === "upload") document.querySelector("#skin-photo-input")?.click();
        else if (action === "camera") await camera();
        else if (action === "cancel-camera") {
          stopCamera();
          bridge.closeDialog();
        } else if (action === "capture") {
          const token = epoch;
          button.disabled = true;
          try {
            const blob = await cameraBlob(document.querySelector("#skin-camera-video"));
            if (token !== epoch || route() !== "analyzer" || !state2.settings.consent || !document.querySelector("#dialog").open) return true;
            stopCamera();
            bridge.closeDialog();
            await preview(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
          } catch (e) {
            if (token === epoch) {
              button.disabled = false;
              bridge.toast(e.message);
            }
          }
        } else if (action === "continue") {
          if (!state2.settings.consent) return true;
          ui2.scanning = true;
          ui2.message = "Preparing your guided preview. No skin detection is running.";
          refresh();
          const token = photoEpoch;
          setTimeout(() => {
            if (token !== photoEpoch || !current()) return;
            ui2.scanning = false;
            ui2.stage = "questions";
            ui2.message = "Preview ready. Tell us what you notice below.";
            refresh();
            document.querySelector("#skin-questions")?.scrollIntoView({ behavior: "smooth" });
          }, 900);
        } else if (action === "questions" || action === "new-checkin") {
          ui2.stage = "questions";
          ui2.message = "Add a fresh photo or update your preferences below.";
          bridge.navigate("analyzer");
          setTimeout(() => document.querySelector("#skin-questions")?.scrollIntoView(), 0);
        } else if (action === "recommend") {
          const r = recommendation();
          stage(r);
          ui2.optimized = null;
          refresh();
          bridge.toast(r.incomplete ? "Budget is too low for all essentials. Review the missing steps." : "Your sample routine is ready.");
        } else if (action === "optimize") {
          ui2.optimized = optimizeRoutine(products, bridge.getShop().kit, state2.profile, state2.responses);
          stage(ui2.optimized);
          refresh();
          bridge.toast("Your routine is simplified within your budget. Review each product.");
        } else if (action === "alternatives") compareOptions(button.dataset.id);
        else if (action === "choose") {
          const p = products.find((p2) => p2.id === button.dataset.id);
          if (p && eligibleProducts(products, state2.profile, state2.responses).includes(p)) {
            const picks = products.filter((q) => bridge.getShop().kit.includes(q.id) && q.category !== p.category);
            picks.push(p);
            if (totals(picks).total > state2.profile.budget) {
              bridge.toast("This swap is over your budget.");
              return true;
            }
            stage({ products: picks, reasons: recommendation().reasons });
            bridge.closeDialog();
            refresh();
            bridge.toast("Your routine and shopping kit are updated.");
          }
        } else if (action === "remove") {
          stage({ products: products.filter((p) => bridge.getShop().kit.includes(p.id) && p.id !== button.dataset.id), reasons: recommendation().reasons });
          refresh();
        } else if (action === "delete-entry") {
          state2.journal = state2.journal.filter((r) => r.id !== button.dataset.id);
          save2();
          refresh();
        } else if (action === "confirm-images" || action === "confirm-history") bridge.openDialog(action === "confirm-images" ? "Delete your saved photos?" : "Delete your skin diary?", `<div class="modal-form"><p>${action === "confirm-images" ? "This removes saved photos and the current preview. Profile and journal records remain." : "This removes your skin profile, check-ins, saved photos, checklist history, product responses and journal. Your shopping kit stays separate."}</p><button class="button primary" data-skin-action="${action === "confirm-images" ? "delete-images" : "delete-history"}">Yes, delete ${action === "confirm-images" ? "images" : "skin history"}</button><button class="button secondary" data-action="close-dialog">Keep my data</button></div>`);
        else if (action === "delete-images" || action === "delete-history") {
          const cleared = await clearImages();
          if (action === "delete-history") clearHistory();
          bridge.closeDialog();
          refresh();
          bridge.toast(cleared ? action === "delete-images" ? "Your images are deleted." : "Your skin history is deleted." : "Diary updated; saved images could not be cleared. See the storage message.");
        }
        return true;
      },
      async submit(form) {
        if (!form.id.startsWith("skin-")) return false;
        if (!form.reportValidity()) return true;
        const data = new FormData(form);
        if (form.id === "skin-profile-form") {
          if (!state2.settings.consent) {
            bridge.toast("Allow local processing before creating a snapshot.");
            bridge.navigate("analyzer");
            return true;
          }
          const profile = normalizeProfile({ skin: data.get("skin"), goals: data.getAll("goals"), budget: Number(data.get("budget")), experience: data.get("experience"), observations: Object.fromEntries([...data.entries()].filter(([k]) => k.startsWith("obs-")).map(([k, v]) => [k.slice(4), v])) });
          const record = { id: id(), date: localDay(), profile, photoId: null };
          const token = photoEpoch;
          const photo = ui2.photo;
          if (state2.settings.storePhotos && photo) {
            try {
              await putPhoto(record.id, photo.dataUrl);
              if (token !== photoEpoch || !state2.settings.consent) {
                await deletePhoto(record.id);
                return true;
              }
              record.photoId = record.id;
              ui2.images[record.id] = photo.dataUrl;
            } catch (e) {
              bridge.toast("Snapshot saved without a photo: " + e.message);
            }
          }
          if (token !== photoEpoch || !state2.settings.consent || route() !== "analyzer") {
            if (record.photoId) await deletePhoto(record.photoId).catch(() => {
            });
            return true;
          }
          state2.profile = profile;
          state2.latest = record;
          state2.history.push(record);
          if (state2.history.length > 40) {
            const old = state2.history.shift();
            if (old.photoId) {
              delete ui2.images[old.photoId];
              void deletePhoto(old.photoId).catch(() => {
              });
            }
          }
          const saved = save2();
          if (!saved && record.photoId) {
            const photoId = record.photoId;
            record.photoId = null;
            delete ui2.images[photoId];
            await deletePhoto(photoId).catch(() => {
            });
          }
          if (token !== photoEpoch) return true;
          stage(recommendation());
          ui2.optimized = null;
          bridge.navigate("analyzer/snapshot");
        } else if (form.id === "skin-journal-form") {
          const date = String(data.get("date")), note2 = String(data.get("note") || "").trim();
          if (!note2 || date > localDay()) return true;
          state2.journal.push({ id: id(), date, kind: String(data.get("kind")), note: note2.slice(0, 1200), productId: String(data.get("productId") || "") });
          state2 = normalizeSkinState(state2, products);
          save2();
          refresh();
          bridge.toast("Your journal entry is saved on this device.");
        } else if (form.id === "skin-response-form") {
          const productId = String(data.get("productId"));
          if (!products.some((p) => p.id === productId)) return true;
          state2.responses[productId] = { status: String(data.get("status")), note: String(data.get("note") || "").slice(0, 500) };
          state2 = normalizeSkinState(state2, products);
          save2();
          refresh();
          bridge.toast(["discomfort", "stopped"].includes(state2.responses[productId]?.status) ? "This product is excluded from new recommendations and checklists." : "Your product response is saved.");
        } else if (form.id === "skin-privacy-form") {
          const next = { consent: data.has("consent"), storePhotos: data.has("storePhotos") && data.has("consent") && data.has("saveHistory"), saveHistory: data.has("saveHistory"), photoCleanupPending: state2.settings.photoCleanupPending, reminderMorning: data.has("reminderMorning"), reminderNight: data.has("reminderNight"), morningTime: String(data.get("morningTime")), nightTime: String(data.get("nightTime")) };
          const removeImages = !next.storePhotos || !next.consent;
          state2.settings = next;
          const cleared = removeImages ? await clearImages() : true;
          if (!next.saveHistory) clearHistory();
          save2();
          refresh();
          remind();
          bridge.toast(cleared ? "Your privacy and reminder preferences are saved." : "Preferences saved; image deletion failed. Retry Delete All Images or clear this site’s browser storage.");
        }
        return true;
      }
    };
  }

  // src/app.js
  var state = loadState();
  var ui = { filters: { ...state.preferences }, builderStep: state.kit.length ? 2 : 1, builderCategory: "Cleanser", reasons: {}, incomplete: false, minimum: 0, dealTab: "flash", lastOrder: null };
  var main = document.querySelector("#main");
  var dialog = document.querySelector("#dialog");
  var product = (id) => products.find((p) => p.id === id);
  var storageNotice = false;
  var skin = createSkinAnalyzer({ getShop: () => state, render, navigate, toast, openDialog, closeDialog, stageRoutine(picks, profile, reasons) {
    state.kit = picks.map((p) => p.id);
    state.profile = { ...state.profile, budget: profile.budget };
    ui.reasons = reasons;
    ui.builderStep = 2;
    ui.incomplete = !["Cleanser", "Moisturizer", "Sunscreen"].every((cat) => picks.some((p) => p.category === cat));
    save();
  } });
  function toast(message) {
    const el = document.querySelector("#toast");
    el.textContent = message;
    el.classList.add("visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("visible"), 3500);
  }
  function save() {
    if (!persistState(state) && !storageNotice) {
      storageNotice = true;
      toast("Browser storage is unavailable. Your mix will last until this page closes.");
    }
  }
  function currentRoute() {
    return location.hash.slice(1).split("?")[0] || "home";
  }
  function render() {
    const route = currentRoute(), base = route.split("/")[0];
    document.querySelector("#header").innerHTML = header(state, base);
    document.querySelector("#bottom-nav").innerHTML = bottomNav(base);
    const views = { home: () => renderHome(state), discover: () => renderDiscover(state, ui), builder: () => renderBuilder(state, ui), deals: () => renderDeals(state, ui), wishlist: () => renderWishlist(state), profile: () => renderProfile(state), cart: () => renderCart(state), checkout: () => renderCheckout(state), success: () => ui.lastOrder ? renderOrderSuccess(ui.lastOrder) : renderProfile(state) };
    main.innerHTML = base === "analyzer" ? skin.render(route) : base === "product" ? renderProduct(product(route.split("/")[1]), state) : (views[base] || views.home)();
    document.querySelector("#search-input").value = ui.filters.q || "";
    document.title = `SkinMix — ${base === "home" ? "Your skin. Your mix." : base === "builder" ? "Build My Kit" : base === "product" ? product(route.split("/")[1])?.name || "Discover" : base[0].toUpperCase() + base.slice(1)}`;
  }
  function navigate(route) {
    if (currentRoute() === route) {
      render();
      window.scrollTo({ top: 0 });
    } else location.hash = route;
  }
  function goDiscover(filters) {
    ui.filters = { ...state.preferences, ...filters };
    navigate("discover");
  }
  function addToKit(p) {
    if (!p) return;
    const replaced = state.kit.map(product).find((v) => v.category === p.category);
    state.kit = state.kit.filter((id) => product(id).category !== p.category);
    state.kit.push(p.id);
    delete ui.reasons[p.id];
    save();
    render();
    toast(replaced && replaced.id !== p.id ? `${p.category} replaced. Your total is updated.` : "Added to your kit. A little more you.");
  }
  function addToCart(p) {
    if (!p) return;
    const old = state.cart.find((i) => i.id === p.id);
    if (old) old.qty = Math.min(99, old.qty + 1);
    else state.cart.push({ id: p.id, qty: 1 });
    save();
    render();
    toast("Added to your shopping bag.");
  }
  function rememberProduct() {
    if (currentRoute().startsWith("product/")) {
      const p = product(currentRoute().split("/")[1]);
      if (p) {
        state.recent = [p.id, ...state.recent.filter((id) => id !== p.id)].slice(0, 12);
        save();
      }
    }
  }
  function openDialog(title, body) {
    dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button data-action="close-dialog" aria-label="Close dialog">${icon("close")}</button></div>${body}`;
    if (!dialog.open) dialog.showModal();
  }
  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  function showAlternatives(p) {
    const list = alternatives(p, products, state.profile.skin);
    openDialog("A little less spend.", `<p class="small muted">Cheaper ${p.category.toLowerCase()} choices for ${state.profile.skin} skin. Current pick: ${money(p.price)}.</p>${list.length ? list.map((q) => `<article class="alternative-row"><a href="#product/${q.id}" class="mini-product-art" data-action="close-dialog">${productArt(q)}</a><div><span class="brand-name">${q.brand}</span><h3>${q.name}</h3><p>${q.ingredients.join(", ")} · ★ ${q.rating}</p><p>${q.skin.join(", ")} skin</p><strong>${money(q.price)}</strong><span class="green-text">Save ${money(p.price - q.price)} more</span></div><button class="button primary" data-action="replace-kit" data-id="${q.id}">Choose</button></article>`).join("") : '<div class="inline-notice">You already have the lowest-priced sample match for your skin type.</div>'}`);
  }
  function showAllAlternatives() {
    const rows2 = state.kit.map(product).map((p) => ({ p, q: alternatives(p, products, state.profile.skin)[0] })).filter((v) => v.q);
    openDialog("Make room in your budget.", `<p class="small muted">Swap any step with a cheaper sample choice that matches your skin.</p>${rows2.length ? rows2.map(({ p, q }) => `<article class="alternative-row"><div><span class="brand-name">${p.category}</span><h3>${q.brand} · ${q.name}</h3><p>${q.ingredients.join(", ")} · ★ ${q.rating}</p><p>Replace ${p.brand} · ${money(p.price)} with ${money(q.price)}</p><strong class="green-text">Save ${money(p.price - q.price)} more</strong></div><button class="button primary" data-action="replace-kit" data-id="${q.id}">Swap</button></article>`).join("") : '<div class="inline-notice">Your selected products are already the lowest-priced sample matches. You can also remove an optional step.</div>'}`);
  }
  function makeRoutine(profile) {
    const result = recommendRoutine(products, profile);
    state.profile = profile;
    state.kit = result.products.map((p) => p.id);
    ui.reasons = result.reasons;
    ui.incomplete = result.incomplete;
    ui.minimum = result.minimum;
    ui.builderStep = 2;
    save();
    navigate("builder");
    toast(result.incomplete ? "Your budget needs a little more room for all essentials." : "Your personalized mix is ready.");
    return result;
  }
  async function copyText(text2, message) {
    try {
      await navigator.clipboard.writeText(text2);
      toast(message);
    } catch {
      const input = dialog.querySelector("input");
      if (input) {
        input.focus();
        input.select();
      }
      toast("Select the link and copy it to share your mix.");
    }
  }
  function importSharedKit() {
    if (!location.hash.includes("?")) return;
    const params = new URLSearchParams(location.hash.split("?")[1]);
    if (params.has("kit")) {
      const ids = params.get("kit").split(",").slice(0, 8), budget = Number(params.get("budget"));
      const next = sanitizeState({ ...state, kit: ids, profile: { ...state.profile, budget } }, products);
      if (next.kit.length) {
        state.kit = next.kit;
        state.profile.budget = next.profile.budget;
        ui.builderStep = 2;
        ui.reasons = {};
        save();
        toast("Shared mix loaded. Make it your own.");
      }
      history.replaceState(null, "", location.pathname + location.search + "#builder");
    }
  }
  document.addEventListener("click", async (e) => {
    const skinButton = e.target.closest("[data-skin-action]");
    if (skinButton) {
      e.preventDefault();
      try {
        await skin.click(skinButton);
      } catch {
        toast("Something could not be completed. Please try again.");
      }
      return;
    }
    const b = e.target.closest("[data-action]");
    if (!b) {
      const anchor = e.target.closest('a[href="#builder"]');
      if (anchor && currentRoute() === "builder") {
        e.preventDefault();
        ui.builderStep = 1;
        render();
        window.scrollTo(0, 0);
      }
      const s = document.querySelector("#suggestions");
      if (s && !e.target.closest(".search-form")) s.hidden = true;
      return;
    }
    const a = b.dataset.action, p = product(b.dataset.id);
    if (a === "close-dialog") {
      closeDialog();
      return;
    }
    if (a === "wishlist" && p) {
      const was = state.wishlist.includes(p.id);
      state.wishlist = was ? state.wishlist.filter((id) => id !== p.id) : [...state.wishlist, p.id];
      save();
      render();
      toast(was ? "Removed from your wishlist." : "Saved a little love to your wishlist.");
    } else if (a === "add-kit" && p) addToKit(p);
    else if (a === "add-cart" && p) addToCart(p);
    else if (a === "category") goDiscover({ category: b.dataset.category });
    else if (a === "concern") goDiscover({ concern: b.dataset.concern });
    else if (a === "skin") goDiscover({ skin: b.dataset.skin });
    else if (a === "clear-filters") {
      ui.filters = {};
      render();
    } else if (a === "remove-filter") {
      delete ui.filters[b.dataset.key];
      render();
    } else if (a === "search-suggestion") {
      goDiscover({ q: b.dataset.query });
    } else if (a === "builder-step") {
      ui.builderStep = Number(b.dataset.step);
      render();
      window.scrollTo({ top: 0 });
    } else if (a === "builder-category") {
      ui.builderCategory = b.dataset.category;
      render();
      document.querySelector("#builder-products")?.scrollIntoView({ block: "start" });
    } else if (a === "replace-category") {
      ui.builderCategory = b.dataset.category;
      ui.builderStep = 2;
      render();
      document.querySelector("#builder-products")?.scrollIntoView({ block: "start" });
    } else if (a === "remove-kit" && p) {
      state.kit = state.kit.filter((id) => id !== p.id);
      delete ui.reasons[p.id];
      save();
      render();
      toast("Removed from your kit.");
    } else if (a === "alternatives" && p) showAlternatives(p);
    else if (a === "all-alternatives") showAllAlternatives();
    else if (a === "replace-kit" && p) {
      closeDialog();
      addToKit(p);
    } else if (a === "budget-kit") {
      state.profile.budget = Number(b.dataset.budget);
      ui.builderStep = 1;
      save();
      navigate("builder");
    } else if (a === "save-kit") {
      if (!state.kit.length) {
        toast("Add products before saving your kit.");
        return;
      }
      openDialog("Keep your favourite mix.", `<form id="save-kit-form" class="modal-form"><p>A daily routine, a winter mix, or a little care for college. Give this kit a name.</p><label>Kit name<input name="name" maxlength="60" minlength="1" required placeholder="My Daily Routine" value="My Daily Routine"></label><button class="button primary" type="submit">Save My Kit</button></form>`);
    } else if (a === "share-kit") {
      const url = new URL(location.href);
      url.hash = `builder?kit=${state.kit.join(",")}&budget=${state.profile.budget}`;
      openDialog("A little mix to share.", `<div class="modal-form"><p>This link shares the products and budget in your kit. Your personal skin profile stays on your device.</p><label>Kit link<input class="share-input" value="${esc(url.href)}" readonly></label><button class="button primary" data-action="copy-share">${icon("share")} Copy Kit Link</button></div>`);
    } else if (a === "copy-share") await copyText(dialog.querySelector("input").value, "Your kit link is copied.");
    else if (a === "load-kit") {
      const k = state.savedKits.find((k2) => k2.id === b.dataset.id);
      if (k) {
        state.kit = [...k.ids];
        state.profile.budget = k.budget;
        ui.reasons = {};
        ui.incomplete = false;
        ui.builderStep = 2;
        save();
        navigate("builder");
        toast("Your saved mix is ready.");
      }
    } else if (a === "delete-saved") {
      state.savedKits = state.savedKits.filter((k) => k.id !== b.dataset.id);
      save();
      render();
      toast("Saved kit removed.");
    } else if (a === "kit-cart") {
      for (const id of state.kit) {
        if (!state.cart.some((i) => i.id === id)) state.cart.push({ id, qty: 1 });
      }
      save();
      navigate("cart");
      toast("Your whole mix is in the bag.");
    } else if (a === "deal-tab") {
      ui.dealTab = b.dataset.tab;
      render();
    } else if (a === "copy-coupon") {
      state.coupon = "SKIN10";
      save();
      toast("SKIN10 applied to your next demo cart.");
    } else if (a === "quantity") {
      const i = state.cart.find((i2) => i2.id === b.dataset.id);
      if (i) {
        i.qty = Math.max(1, Math.min(99, i.qty + Number(b.dataset.delta)));
        save();
        render();
      }
    } else if (a === "remove-cart") {
      state.cart = state.cart.filter((i) => i.id !== b.dataset.id);
      save();
      render();
      toast("Removed from your bag.");
    } else if (a === "remove-coupon") {
      state.coupon = "";
      save();
      render();
      toast("Coupon removed.");
    } else if (a === "price-alert" && p) {
      const alert = state.alerts.find((v) => v.id === p.id);
      openDialog("A price that feels right.", `<form id="alert-form" class="modal-form" data-id="${p.id}"><p>${p.name} · current sample price ${money(p.price)}. Set a target price. Alerts are checked on this device when you open the app; no live feed or outbound notifications are connected.</p><label>Target price (₹)<input type="number" min="1" max="100000" step="1" name="target" value="${alert?.target || Math.floor(p.price * 0.85)}" required></label><button class="button primary" type="submit">${icon("bell")} Save Price Alert</button></form>`);
    } else if (a === "remove-alert") {
      state.alerts = state.alerts.filter((v) => v.id !== b.dataset.id);
      save();
      render();
      toast("Price alert removed.");
    } else if (a === "seller-cart" && p) {
      if (b.dataset.seller === "0") addToCart(p);
      else {
        const s = p.sellers[Number(b.dataset.seller)];
        openDialog("Compare before you mix.", `<div class="modal-form"><p>${s.name} has a sample offer of <strong>${money(s.price)}</strong>. SkinMix’s best sample price is <strong>${money(p.price)}</strong>.</p><p>These are illustrative seller prices; no external store or checkout is connected.</p><button class="button primary" data-action="best-seller-cart" data-id="${p.id}">Add Best Price to Cart</button></div>`);
      }
    } else if (a === "best-seller-cart" && p) {
      closeDialog();
      addToCart(p);
    }
  });
  document.addEventListener("submit", async (e) => {
    const f = e.target;
    if (!(f instanceof HTMLFormElement)) return;
    e.preventDefault();
    const skinSubmit = f.id.startsWith("skin-") ? f.querySelector('button[type="submit"]') : null;
    if (skinSubmit) skinSubmit.disabled = true;
    try {
      if (await skin.submit(f)) return;
    } catch {
      toast("This skin entry could not be saved. Please try again.");
      return;
    } finally {
      if (skinSubmit?.isConnected) skinSubmit.disabled = false;
    }
    const data = new FormData(f);
    if (f.id === "search-form") {
      goDiscover({ q: String(data.get("q") || "").trim() });
    } else if (f.id === "filters-form") {
      ui.filters = { ...ui.filters, ...Object.fromEntries(data.entries()), vegan: data.has("vegan"), crueltyFree: data.has("crueltyFree"), fragranceFree: data.has("fragranceFree") };
      render();
    } else if (f.id === "routine-form" || f.id === "profile-form") {
      const profile = { skin: String(data.get("skin")), concerns: data.getAll("concerns"), budget: Number(data.get("budget")) };
      if (!SKIN_TYPES.includes(profile.skin) || !Number.isFinite(profile.budget) || profile.budget < 100 || profile.budget > 1e5) {
        toast("Choose your skin type and a budget of ₹100–₹1,00,000.");
        return;
      }
      if (f.id === "routine-form") makeRoutine(profile);
      else {
        state.profile = profile;
        state.preferences = { vegan: data.has("vegan"), crueltyFree: data.has("crueltyFree"), fragranceFree: data.has("fragranceFree") };
        save();
        render();
        toast("Your skin profile is saved.");
      }
    } else if (f.id === "save-kit-form") {
      const name = String(data.get("name") || "").trim();
      if (!name) {
        toast("Give your mix a name.");
        return;
      }
      state.savedKits.unshift({ id: crypto.randomUUID(), name: name.slice(0, 60), ids: [...state.kit], budget: state.profile.budget, date: (/* @__PURE__ */ new Date()).toISOString() });
      state.savedKits = state.savedKits.slice(0, 30);
      save();
      closeDialog();
      toast("Your mix is saved. Find it in your profile.");
    } else if (f.id === "alert-form") {
      const p = product(f.dataset.id), target = Number(data.get("target"));
      if (!p || !Number.isFinite(target) || target < 1 || target > 1e5) return;
      state.alerts = state.alerts.filter((a) => a.id !== p.id);
      state.alerts.push({ id: p.id, target, lastPrice: p.price, lastDiscount: discount(p) });
      save();
      closeDialog();
      render();
      toast(p.price <= target ? "Target reached at the current sample price." : "Your device-local price alert is saved.");
    } else if (f.id === "coupon-form") {
      const coupon = String(data.get("coupon") || "").trim().toUpperCase();
      if (coupon !== "SKIN10") {
        toast("That demo code is not available. Try SKIN10.");
        return;
      }
      state.coupon = coupon;
      save();
      render();
      toast("A little extra saving. SKIN10 applied.");
    } else if (f.id === "checkout-form") {
      if (!f.reportValidity() || !state.cart.length) return;
      const order = { id: "SM-DEMO-" + Date.now().toString(36).toUpperCase(), date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(/* @__PURE__ */ new Date()), total: cartTotals(state.cart, products, state.coupon).total, items: state.cart.map((i) => ({ ...i })) };
      state.orders.unshift(order);
      state.orders = state.orders.slice(0, 30);
      state.cart = [];
      state.coupon = "";
      ui.lastOrder = order;
      save();
      navigate("success");
    }
  });
  document.addEventListener("change", async (e) => {
    try {
      if (await skin.change(e.target)) return;
    } catch {
      toast("This update could not be saved. Please try again.");
      return;
    }
    if (e.target.name === "budget-choice") {
      const input = e.target.closest("form").querySelector('input[name="budget"]');
      if (e.target.value !== "custom") input.value = e.target.value;
      else input.focus();
    }
    if (e.target.id === "sort-select") {
      ui.filters.sort = e.target.value;
      render();
    }
  });
  document.addEventListener("input", (e) => {
    if (skin.input(e.target)) return;
    if (e.target.name === "budget") {
      const form = e.target.closest("form"), custom = form.querySelector('input[value="custom"]');
      if (custom) custom.checked = true;
    }
    if (e.target.id === "search-input") {
      const q = e.target.value.trim(), el = document.querySelector("#suggestions");
      const results = q ? filterProducts(products, { q }).slice(0, 5) : [];
      el.innerHTML = results.map((p) => `<button type="button" data-action="search-suggestion" data-query="${esc(p.name)}">${icon("search")} ${p.name}<span class="muted"> · ${money(p.price)}</span></button>`).join("");
      el.hidden = !results.length;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const s = document.querySelector("#suggestions");
      if (s) s.hidden = true;
    }
  });
  window.addEventListener("hashchange", () => {
    skin.leave(currentRoute());
    importSharedKit();
    rememberProduct();
    render();
    const section = new URLSearchParams(location.hash.split("?")[1]).get("section");
    if (section === "reviews" && currentRoute().startsWith("product/")) document.querySelector("#reviews")?.scrollIntoView({ block: "start" });
    else window.scrollTo({ top: 0 });
    main.focus({ preventScroll: true });
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "skinmix-v1") {
      state = loadState();
      render();
    }
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
    }
  });
  importSharedKit();
  rememberProduct();
  render();
  if (state.alerts.some((a) => Object.values(alertStatus(a, product(a.id))).some(Boolean))) toast("A sample price alert is ready. View your profile for details.");
  var modelContext = document.modelContext || navigator.modelContext;
  if (modelContext?.registerTool) {
    const lifecycle = new AbortController();
    window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
    const register = (tool) => {
      try {
        Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {
        });
      } catch {
      }
    };
    register({ name: "search_skinmix_sample_products", description: "Read sample SkinMix products and prices. Does not claim live prices.", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute(input) {
      if (!input || typeof input.query !== "string" || input.query.length > 200) throw new Error("A query of at most 200 characters is required.");
      return filterProducts(products, { q: input.query }).map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category, sample: true }));
    } });
    register({ name: "stage_skinmix_sample_routine", description: "Replace the current device-local kit with a sample routine matching skin type, concerns and budget. Does not purchase anything.", inputSchema: { type: "object", properties: { skin: { type: "string", enum: SKIN_TYPES }, concerns: { type: "array", items: { type: "string", enum: CONCERNS } }, budget: { type: "number", minimum: 100, maximum: 1e5 } }, required: ["skin", "concerns", "budget"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute(input) {
      if (!input || !SKIN_TYPES.includes(input.skin) || !Array.isArray(input.concerns) || !input.concerns.every((c) => CONCERNS.includes(c)) || !Number.isFinite(input.budget) || input.budget < 100 || input.budget > 1e5) throw new Error("Invalid skin profile or budget.");
      const r = makeRoutine(input);
      return { ids: r.products.map((p) => p.id), total: totals(r.products).total, incomplete: r.incomplete, sample: true };
    } });
  }
})();

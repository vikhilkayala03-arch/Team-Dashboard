# SkinMix approved design

The user approved building the app on 5 October 2026 and explicitly instructed implementation. This is a locally runnable, mobile-first shopping prototype using clearly labeled sample products and prices. No purchases, live price feeds, remote accounts, real AI service, or outbound alerts are connected.

## Visual experience
Premium ivory/cream, warm beige, blush, lavender, charcoal, and muted green. Elegant serif headlines with readable sans-serif controls. Subtle organic gradients and botanical imagery, large product photos, soft rounded cards, airy desktop layout, and mobile bottom navigation with Build Kit highlighted.

## Screens and behavior
- Home: searchable navigation, specified hero and calls to action, category shortcuts, today's deals, trending products, under ₹999, acne/dry-skin/sunscreen selections, recently viewed.
- Discover: autocomplete and natural-language price/category searches; brand, price, category, skin type/concern, ingredient, rating, discount, cruelty-free, vegan and fragrance-free filters.
- Product: sample photography, brand, ratings, reviews, MRP/current price/discount/savings/unit price, size, ingredients, benefits, usage, skin compatibility, seller prices, similar products, cheaper alternatives, wishlist, alert, kit/cart actions.
- Builder: skin type, concerns and budget, editable multi-brand products, live budget progress, recommendations with reasons, remove/replace/add, cheaper alternatives, morning/night summary, savings score, save/share/checkout.
- Deals: flash offers, discounts, under ₹500/₹1000, bundle suggestions and sample offers.
- Profile: editable skin profile and preferences, saved named kits, wishlist, viewed items, demo orders and browser-local target-price alerts.
- Cart: quantities, discounts/savings, delivery estimate, coupon, totals and checkout. Checkout validates the contact/delivery form and creates an explicitly simulated local order; no payment/card collection.

## Data and boundaries
At least three sample choices for each of eight categories, from multiple named popular brands; generic mock imagery is explicitly labeled. Catalog values are fixed sample values, including seller comparisons and reviews. Recommendations use transparent on-device scoring and budget optimization, never imply a connected AI model. If a full essentials routine cannot fit the budget, show the shortfall rather than silently exceed it. Device-local persistence stores profile, kit, saved kits, cart, wishlist, viewed products, alerts, and demo orders. Reject malformed stored state. Share encodes kit IDs and budget in a URL and supports clipboard or copy fallback.

## Validation
Node tests cover monetary arithmetic, budget boundaries, recommendations, alternatives, filters/search, routine order, cart/coupon totals and malformed persistence. Check all JS syntax and build the distribution. Browser-check desktop and mobile layout, filters, builder/replacements, saving/reloading, wishlist/alerts, cart quantity/coupon and demo checkout. All assets must be local and available offline after delivery.

# SkinMix

A mobile-first skincare shopping prototype built from your specifications. Premium ivory/cream, warm blush, lavender and soft green, with generated skincare photography.

## Open the app

The preview is at **http://127.0.0.1:5173** while the local server is running.

To start it again on Windows, double-click **Start SkinMix.cmd**, then open that address in Chrome or Edge. Keep the command window open. Press Ctrl+C in that window to stop the server.

Alternatively, run this from the Skin Max folder:

```powershell
npm.cmd run dev
```

Node.js 20 or newer is required. The app itself has no package dependencies and runs without installing packages. Open it through the local server; double-clicking index.html does not load browser ES modules correctly.

## Try your first mix

1. Select **Build My Kit** and choose your skin type, concerns and budget.
2. Select **Build My Routine** for a recommended multi-brand mix. Each choice includes a reason.
3. Remove or replace products. Use **Find a cheaper alternative** to compare suitable options.
4. Select **View My Routine** for the morning/night steps, savings score and budget.
5. Save a named kit, share its product-and-budget link, or send it to your shopping bag.
6. Try **SKIN10** in the cart: 10% off up to ₹150. Complete checkout using sample details.

Discover includes autocomplete, natural-language searches such as “Best sunscreen under ₹500,” and filters for brand, price, skin type, concern, category, ingredients, rating, discount, vegan, cruelty-free and fragrance-free.

Product pages show sample seller comparison, unit prices, ingredients, benefits, usage, reviews, cheaper alternatives, cart/wishlist actions and target-price alerts. Deals includes flash picks, highest discounts, price ranges and bundle/coupon previews.

Profile keeps skin preferences, multiple named kits, wishlist, recent products, local price alerts and demo order history. Kits, cart and preferences persist in this browser. Another device or browser does not share this storage. Shared-kit links include the product IDs and budget; they require the recipient to access the same hosted app address. A localhost link only works on the computer running the app.

## What is demo data?

All 24 product entries, named-brand associations, prices, compatibility tags, ratings, reviews, ethical claims, seller offers and delivery estimates are illustrative. Photos show generic generated packaging, not actual brand packaging. They should be verified and replaced when connecting a real catalog.

The “Budget AI” feature uses on-device scoring and budget optimization. It is not connected to an external AI model. It prioritizes cleanser, moisturizer and sunscreen, adds serum when the budget permits, and tells you when essentials cannot fit. It does not verify medical suitability or ingredient interactions.

Price alerts compare locally stored targets/snapshots with the fixed sample catalog when the app opens. They recognize reached targets, price drops and increased discounts if the sample catalog changes. No live price monitoring, email or push service is connected.

Checkout is simulated. No payment details are collected, no order is sent and no delivery is arranged. Delivery/contact form values are not saved or transmitted; only the demo order ID, date, products and total are saved locally.

## Source files

```text
Skin Max/
  index.html
  styles.css
  Start SkinMix.cmd
  assets/           Local hero, catalog imagery and favicon
  src/
    app.js          Routes and user actions
    views.js        Shopping screens
    core.js         Budget, recommendations, filters, pricing and validation
    catalog.js      24 sample multi-brand products
    store.js        Safe browser persistence
    icons.js        Interface icons
  scripts/
    server.mjs      Local preview
    build.mjs       Checks and static export
  tests/           Domain tests and browser journeys
  docs/            Design, plan, validation and artwork briefs
  dist/            Built static app
```

## Checks and build

```powershell
npm.cmd test
npm.cmd run build
```

The build exports the app to `dist/`, which can be served by a standard static web host. Publishing was not requested; this version stays local.

For browser tests, install the development dependency with `npm.cmd install`, start the local server, then run `npm.cmd run test:browser`. The test config uses locally installed Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Set `SKINMIX_CHROME` to another Chromium executable path if needed.

See [validation details](docs/validation.md) and [artwork briefs](docs/artwork.md).

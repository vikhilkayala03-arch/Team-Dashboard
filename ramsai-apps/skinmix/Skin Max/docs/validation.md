# SkinMix validation

Completed 6 October 2026 (Asia/Kolkata).

## Automated checks

- `npm.cmd test`: 15 domain checks passed. MRP savings, exact/insufficient budgets, compatible cheaper alternatives, natural-language search, intersected filters, routine ordering, quantity/coupon/shipping calculations, corrupt state recovery, zero price ceilings and all three local price-alert conditions.
- `npm.cmd run test:browser`: 11 headless Chrome journeys passed. Real browser interactions exercised recommendation, one-product-per-step replacement, over-budget swaps, morning/night routines, save/reload/load, share-link import, autocomplete/search/filter results, wishlist, seller comparison, target-price alerts, coupon/quantity totals and validated demo checkout.
- `npm.cmd run build`: JavaScript syntax checks passed, required local artwork exists, and the complete static app exported to `dist/`.

Viewport checks cover 320px phones, 390px phones, 768px tablets and 1440px desktops. Every main view was checked for horizontal overflow; the browser reported none. Loaded route/assets reported no HTTP errors or JavaScript runtime errors in the viewport journey.

## Independent review

A read-only reviewer inspected the app against the approved design and plan. Missing-essentials warnings and review navigation were identified, reproduced by failing browser tests, fixed and covered by passing regressions. Zero maximum-price filtering and the empty-search recovery action were also fixed. No known important findings remain.

Warning state is now derived from the current kit in both customization and summary; reloading or restoring a partial routine cannot hide missing essentials. Reviews stay on the product route. Empty-results recovery clears filters. Budget remaining and MRP savings are separate quantities.

## Visual inspection

The generated hero/catalog assets and desktop/mobile home, product, builder and routine screenshots were visually inspected for imagery, spacing, legibility, overlaps and fixed navigation. The final images are under `docs/qa/`.

- [Desktop home](qa/home-desktop.png)
- [Mobile home](qa/home-mobile.png)
- [Desktop routine](qa/routine-desktop.png)
- [Mobile routine](qa/routine-mobile.png)

CUA reported no available connected browser, so the app was validated using disposable headless Chrome sessions. A foreground browser tab could not be opened automatically. The local preview is available for the user to open.

## Prototype boundaries

No live prices, stock checks, external AI, payment, real order processing or outbound alert service is connected. Prices and product information are marked as sample data. Persistence is local to the current browser. Checkout values are validated but not saved/transmitted. Optional feature-detected WebMCP tools were added; native WebMCP validation was unavailable in the installed browser and is not claimed.

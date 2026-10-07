# Vicky Academy
Learn food, discover culture, travel smarter. Plain HTML/CSS/JS – no build step.

## Run it
Unzip and open `index.html` in a browser. (Or serve the folder: `python3 -m http.server`.)

## Structure
- `index.html` – home page; `pages/` – learn, destinations, scanner, markets (adventures), recipes, profile
- `css/` – `style.css` (colours in `:root`), `responsive.css`, `animations.css`
- `js/data.js` – ALL content (countries, dishes, lessons, recipes). Edit this to add more.
- `js/app.js` – nav, footer, progress store (XP/streak in localStorage) and the **Chef Vicky AI chat**
- `js/scanner.js` – **AI Menu Scanner**; `quiz.js`, `lessons.js`, `markets.js`, `profile.js`
- `assets/` – put your own photos in `images/…` and icons in `icons/`

## AI features
1. **AI Menu Scanner** – dish → meaning, ingredients, allergen warnings, story.
2. **Chef Vicky chat** – floating assistant on every page.
Both run offline on the dish library in `data.js`. To use a real AI model (photo reading, any dish in the world), host a small backend that calls an AI API and set `AI_ENDPOINT` in `js/data.js`.
- Chat sends `{question}` and expects `{answer}`.
- Scanner sends `{menu:[lines], image:dataURL}` and expects `{dishes:[{html:"<div class='dish'>…</div>"}]}`.
Never put an API key in front-end code.

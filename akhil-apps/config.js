/* ================================================================
   QUADRANT: YOUR API KEYS
   This is the only file you need to edit.

   1. Paste each key between the quotes "" below.
   2. Save the file (Ctrl + S).
   3. Refresh the website in your browser.

   Every app still opens without keys and tells you what is missing.
   ================================================================ */

window.QUADRANT_CONFIG = {

  // Google Gemini: the AI used by all four apps
  // (reading photos, the Mitra helper bot, explanations, meal plans).
  // Free key: https://aistudio.google.com/apikey
  GEMINI_API_KEY: "",

  // Alpha Vantage: real past share prices in StockMitra.
  // Free key (25 look-ups a day): https://www.alphavantage.co/support/#api-key
ALPHA_VANTAGE_API_KEY: "",

  // Advanced: the Gemini model. Leave this as it is.
  // If Google retires it, the apps try newer ones on their own.
  GEMINI_MODEL: "gemini-3.8-flash"

};

/* IMPORTANT: if this folder goes into a PUBLIC GitHub repository, anyone can copy
   these keys, and Google automatically disables keys it finds in public code.
   Keep the repository private, or share this one file with the team privately
   (WhatsApp, Drive) and keep it out of GitHub. */

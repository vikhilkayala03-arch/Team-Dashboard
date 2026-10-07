import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',timeout:25000,expect:{timeout:5000},workers:1,
 use:{baseURL:'http://127.0.0.1:5173',headless:true,launchOptions:{executablePath:process.env.SKINMIX_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'},viewport:{width:1440,height:1000}},
 reporter:'list',outputDir:'test-results'
});

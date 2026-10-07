import {test,expect} from '@playwright/test';

test('over-budget kit gives cheaper swaps and remains one product per category',async({page})=>{
 await page.goto('/#builder?kit=minimalist-cleanser,minimalist-serum,dotkey-moisturizer,reequil-sunscreen&budget=500');
 await expect(page.locator('.kit-row')).toHaveCount(4);
 await expect(page.locator('.budget-status')).toHaveClass(/danger/);
 await page.locator('.budget-panel').getByRole('button',{name:'Find Cheaper Alternatives',exact:true}).click();
 await expect(page.locator('.alternative-row')).not.toHaveCount(0);
 await page.locator('.alternative-row').first().getByRole('button',{name:'Swap',exact:true}).click();
 await expect(page.locator('.kit-row')).toHaveCount(4);
 const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('skinmix-v1')));
 expect(s.kit).toContain('plum-cleanser');expect(s.kit).not.toContain('minimalist-cleanser');
 await page.locator('.kit-row').first().getByRole('button',{name:'Replace',exact:true}).click();
 await expect(page.locator('#builder-products')).toBeVisible();
 await page.locator('#builder-products [data-action="add-kit"]:not(.selected)').first().click();
 await expect(page.locator('.kit-row')).toHaveCount(4);
});

test('shared links roundtrip products and budget without storing skin profile',async({page,context})=>{
 await page.goto('/#builder?kit=simple-cleanser,deconstruct-serum,simple-moisturizer,deconstruct-sunscreen&budget=1000');
 await page.getByRole('button',{name:'View My Routine'}).click();
 await page.getByRole('button',{name:'Share Kit',exact:true}).click();
 const link=await page.locator('.share-input').inputValue();
 expect(link).not.toContain('skin=');
 const second=await context.newPage();await second.goto(link);
 await expect(second.locator('.kit-row')).toHaveCount(4);
 await expect(second.locator('.budget-number').first()).toContainText('₹1,000');
 await second.close();
});

test('insufficient funds and malformed browser storage recover without runtime errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('skinmix-v1','{broken json'));
 await page.goto('/#builder');
 await page.locator('#routine-form input[name="budget"]').fill('100');
 await page.getByRole('button',{name:'Build My Routine',exact:true}).click();
 await expect(page.locator('.inline-notice.warning')).toContainText('cannot cover');
 await expect(page.locator('.budget-status')).not.toHaveClass(/danger/);
 await page.goto('/#product/unknown');
 await expect(page.getByRole('heading',{name:'That product is not in this mix.'})).toBeVisible();
 expect(errors).toEqual([]);
});

test('all main screens fit small phone, tablet and desktop and assets load',async({page})=>{
 const errors=[],broken=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)broken.push(r.url());});
 for(const width of [320,768,1440]){
  await page.setViewportSize({width,height:width===1440?1000:844});
  for(const route of ['home','discover','builder','deals','profile','wishlist','cart','product/minimalist-serum']){
   await page.goto('/#'+route);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflow at ${width}`).toBe(true);
   if(width===1440&&route==='home')await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
   if(width===320&&route==='builder')await page.screenshot({path:'test-results/builder-mobile.png',fullPage:true});
   if(width===1440&&route==='product/minimalist-serum')await page.screenshot({path:'test-results/product-desktop.png',fullPage:true});
  }
 }
 expect(errors).toEqual([]);expect(broken).toEqual([]);
});

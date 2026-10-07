import {test,expect} from '@playwright/test';

test('incomplete kit remains visibly incomplete on reload and routine summary',async({page})=>{
 await page.goto('/#builder');
 await page.locator('#routine-form input[name="budget"]').fill('300');
 await page.getByRole('button',{name:'Build My Routine',exact:true}).click();
 await expect(page.locator('.inline-notice.warning')).toBeVisible();
 await page.reload();
 await expect(page.locator('.inline-notice.warning')).toBeVisible();
 await page.getByRole('button',{name:'View My Routine'}).click();
 await expect(page.locator('.inline-notice.warning')).toBeVisible();
});

test('product review navigation stays on product and reaches the reviews',async({page})=>{
 await page.goto('/#product/minimalist-serum');
 await page.getByRole('link',{name:/sample reviews/}).click();
 await expect(page).toHaveURL(/#product\/minimalist-serum/);
 await expect(page.locator('.detail-content h1')).toContainText('Niacinamide');
 await expect(page.locator('#reviews')).toBeInViewport();
});

test('empty results recovery button resets filters immediately',async({page})=>{
 await page.goto('/#discover');
 await page.locator('#filters-form input[name="max"]').fill('1');
 await page.getByRole('button',{name:'Apply Filters',exact:true}).click();
 await page.locator('.empty-state').getByRole('link',{name:'Discover Products'}).click();
 await expect(page.locator('.product-card')).toHaveCount(24);
});

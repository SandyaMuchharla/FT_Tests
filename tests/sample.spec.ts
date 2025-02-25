import {test, expect} from '@playwright/test'
import exp from 'constants';

test.describe('Search FT', ()=>{
    test('Search Finacial Times on Wiki', async({page}) =>{
        await page.goto("https://www.wikipedia.org/");
        await page.locator('#searchInput').fill('Financial Times');
        await page.locator('button[type="submit"]').click();
        await page.waitForSelector("#firstHeading");
        const firstResult = await page.innerText("#firstHeading");
        expect(firstResult).toBe("Financial Times");
        await page.getByLabel('Dark').click();
        await expect(page.locator('#skin-client-pref-skin-theme-value-night')).toBeChecked()
        const editorName = await page.innerText("th:has-text('Editor') + td");
        console.log(editorName);
        await expect(editorName).toContain("Roula Khalaf");
        const editorLink =await page.locator("th:has-text('Editor') + td a").getAttribute("href");
        console.log(editorLink);
        await expect(editorLink).toContain("Roula_Khalaf");

    })
});
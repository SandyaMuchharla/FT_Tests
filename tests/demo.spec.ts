import {test, expect} from '@playwright/test'
import DemoPage from './pages/demoPage';

test.describe('FT Home', ()=>{

    [
        { submenu: 'UK Politics', submenuTitle: 'UK politi' },
        { submenu: 'UK Home', submenuTitle: 'UK' },
    ].forEach(({ submenu, submenuTitle }) => {
        test(`Navigating to ${submenu}`, async ({ page }) => {
            const demoPage = new DemoPage(page);
            await page.goto('https://www.ft.com/');
    
            await demoPage.acceptCookies();
            await demoPage.clickOnMenu();
            await demoPage.clickOnSubMenu(submenu);
            await expect(page).toHaveTitle(submenuTitle);
        });
    });

    test('FT UK Politics POM', async({page}) => {
        const demoPage = new DemoPage(page);
        await page.goto('https://www.ft.com/');
        demoPage.acceptCookies();
        demoPage.clickOnMenu();
        demoPage.clickOnSubMenu('UK Politics');
        await expect(page).toHaveTitle('UK politics');
    });

    test('FT UK Politics', async({page}) => {
        //await page.setViewportSize({ width: 1600, height: 1080 });
        await page.goto('https://www.ft.com/');
        const iframe = page.frameLocator('iframe[title="SP Consent Message"]');
         // Locate the "Accept Cookies" button inside the iframe
        const acceptButton = iframe.locator('button:has-text("Accept Cookies")');
  
        // Click the "Accept Cookies" button
        await acceptButton.click();
        const closeBanner = page.locator("//button[@title='Close banner']");
        if(await closeBanner.isVisible()){
            await closeBanner.click();
        }
        await page.waitForTimeout(2000);
        await page.waitForSelector('xpath=//div[@class="o-header__container"]/ul/li//a[@data-trackable="UK"]', { timeout: 3000, state: 'visible' });
        await page.locator("//div[@class='o-header__container']/ul/li//a[@data-trackable='UK']").hover();     
        const menuLink =  page.getByRole('link', { name: 'UK Politics', exact: true });
        if(!await menuLink.isVisible()){
            await page.locator("//div[@class='o-header__container']/ul/li//a[@data-trackable='UK']").hover();
        }
        //await page.locator('a.o-header__mega-link', { hasText: 'UK Politics' }).click();
        await menuLink.click();
        await expect(page).toHaveTitle('UK politics');
        await page.waitForTimeout(2000);
        await page.locator('span.o-footer__matrix-link__copy', { hasText: 'Terms & Conditions' }).click();
        await expect(page).toHaveTitle('Terms and Conditions | Help Centre');
    })

    test('FT Aboutus', async({page}) => {
        await page.goto('https://aboutus.ft.com/');
        await page.getByRole('link', { name: 'COMPANY', exact: true }).hover();
        await page.waitForTimeout(2000);
        //const text = await page.locator('ul.nav_item_sublist').locator('li a h5').allTextContents();
        // await expect(text).toContain('Sustainability');

        const ulElement = page.locator('ul.nav_item_sublist');

        // Get all <li> elements inside the <ul>
        const liElements = ulElement.locator('li');
    
        // Desired text to match
        let targetText:string = 'LEADERSHIP';
    
        // Iterate through the <li> elements
        for (let i = 0; i < await liElements.count(); i++) {
            // Locate the <a> element inside the current <li>
            const linkElement = liElements.nth(i).locator('a.nav_item');
    
            // Get the text content of the <h5> inside the <a>
            let text:string  = await linkElement.locator('h5').innerText();
            console.log(`Clicked on "${text}"`);
    
            // If the text matches, click on the <a> element
            if (text === targetText) {
                await linkElement.click();
                console.log(`Clicked on "${targetText}"`);
                break; // Exit the loop after clicking
            }
        }
    
        // Optional: Verify that the click worked (e.g., URL change or new page load)
        await expect(page).toHaveURL(/leadership/);
    })
  
    test.afterEach(async ({ page }, testInfo) => {
        // if (testInfo.status !== 'passed') { // Only take screenshot if the test fails
        //   const screenshotPath = `test-results/screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;
        //   await page.screenshot({ path: screenshotPath, fullPage: true });
        //   console.log(`📸 Screenshot saved: ${screenshotPath}`);
        // }

        if (testInfo.status !== 'passed') {
            const screenshot = await page.screenshot();
            testInfo.attach('failure-screenshot', {
              body: screenshot,
              contentType: 'image/png',
            });
          }

    });
  
  });
  
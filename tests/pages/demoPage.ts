import { Page, Locator } from "@playwright/test";

export default class DemoPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private elements = {
        iframe       : "iframe[title='SP Consent Message']",
        acceptButton : "button:has-text('Accept Cookies')",
        closeBanner  : "//button[@title='Close banner']",
        menuItemUK   : "//div[@class='o-header__container']/ul/li//a[@data-trackable='UK']"
    }

    private subLinkName(linkName: string):Locator {
        return this.page.getByRole('link', { name: linkName, exact: true });
    }

    async acceptCookies(){
        const iframe = this.page.frameLocator(this.elements.iframe);
            // Locate the "Accept Cookies" button inside the iframe
        const acceptButton = iframe.locator(this.elements.acceptButton);
        await acceptButton.waitFor({state: 'visible' });
        //await pageFixture.page.waitForTimeout(2000);
        if(await acceptButton.isVisible()){
            await acceptButton.click();
        }
        const closeBanner = this.page.locator(this.elements.closeBanner);
        await closeBanner.waitFor({state: 'visible' });
        if(await closeBanner.isVisible()){
            await closeBanner.click();
        }
    }

    async clickOnMenu(){
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(`xpath=${this.elements.menuItemUK}`, { timeout: 3000, state: 'visible' });
        await this.page.locator(this.elements.menuItemUK).hover();
    }

    async clickOnSubMenu(linkName: string){
        const menuLink =  this.subLinkName(linkName);
        await menuLink.waitFor({state:"visible"});
        if(!await menuLink.isVisible()){
                await this.page.locator(this.elements.menuItemUK).hover();
        }
        await menuLink.click();
    }

}
import { Page } from 'puppeteer';

export async function selectTextContent(page: Page, selector: string) {
    await page.waitForSelector(selector);
    return await page.$eval(selector, (el) => {
        return el.textContent?.trim();
    });
}

import Puppeteer from 'puppeteer';
import { Logger } from '../logger';
import { morningStar } from './morningStar';

async function testScrape() {
    const browser = await Puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.morningstar.com/etfs/arcx/spy/performance', {
        waitUntil: 'domcontentloaded',
    });
    Logger.info(await morningStar(page));
    await page.close();
    await browser.close();
}

testScrape();

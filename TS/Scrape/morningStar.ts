import { Page } from 'puppeteer';
import { Logger } from '../logger';
import { selectTextContent } from '../PuppeteerUtil/util';

// VARIABLE CONSTANTS
const TICKER_SELECTOR = 'h1 > abbr';
const NAME_SELECTOR = 'h1 > span';
const TABLE_SELECTOR = 'table.mds-table__sal';

function getPageTableValues(el: Element) {
    const cells = (el as HTMLTableElement).rows?.[1]?.cells;
    if (!cells) return null;
    const [, ...values] = cells;
    return values.map((val) => `${val.innerText.replace(/[—™]/gi, '')}%`);
}

function getPageTableHead(el: Element) {
    const cells = (el as HTMLTableElement).rows?.[0]?.cells;
    if (!cells) return null;
    const [, ...values] = cells;
    return values.map((val) => val.innerText);
}

// NOTE: could be implemented with Promise.all for performance but I'm too lazy
export async function morningStar(page: Page) {
    const name = await selectTextContent(page, NAME_SELECTOR);
    const ticker = await selectTextContent(page, TICKER_SELECTOR);

    await page.waitForSelector(TABLE_SELECTOR);
    const values = await page.$eval(TABLE_SELECTOR, getPageTableValues);
    Logger.info(name, ticker, values);
    if (!(name && ticker && values)) return null;
    return [name, ticker, ...values];
}

export async function morningStarHead(page: Page) {
    const name = 'name';
    const ticker = 'ticker';

    await page.waitForSelector(TABLE_SELECTOR);
    const values = await page.$eval(TABLE_SELECTOR, getPageTableHead);
    Logger.info(name, ticker, values);
    if (!(name && ticker && values)) return null;
    return [name, ticker, ...values];
}

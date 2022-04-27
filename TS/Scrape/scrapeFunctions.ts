import { Page } from 'puppeteer';
import { morningStar } from './morningStar';

interface ScrapeFunctions {
    [url: string]: (page: Page) => Promise<string[] | null>;
}

export const scrapeFunctions: ScrapeFunctions = {
    'www.morningstar.com': morningStar,
};

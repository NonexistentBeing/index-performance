import { Page } from 'puppeteer';
import { morningStar, morningStarHead } from './morningStar';

export type ScrapeFun = (page: Page) => Promise<string[] | null>;

export interface ScrapeFunctions {
    [url: string]: ScrapeFun | undefined;
}

export const scrapeFunctions: ScrapeFunctions = {
    'www.morningstar.com': morningStar,
};

export const scrapeHeadFunctions: ScrapeFunctions = {
    'www.morningstar.com': morningStarHead,
};

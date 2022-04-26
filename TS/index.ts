import Puppeteer, { Browser } from 'puppeteer';
import { Logger } from './logger';
import { scrapeFunctions } from './Scrape/scrapeFunctions';
import { readIndexURL, writeCSV } from './FSUtil/util';
import path from 'path';

// Utility functions
const nullFn = (..._: any) => null;

function notNull(val: any) {
    return val !== null;
}

function getScrapeFunction(url: string) {
    const { hostname } = new URL(url);
    if (!(hostname in scrapeFunctions)) {
        Logger.error(
            `Host "${hostname}" is not supported, ${url} could not be scraped`
        );
        return nullFn;
    }
    return scrapeFunctions[hostname];
}

// Puppeteer functions
async function fetchURL(browser: Browser, url: string) {
    const page = await browser.newPage();
    await page.goto(url);
    const scrapeFun = getScrapeFunction(url);
    const scraped = await scrapeFun(page);
    await page.close();
    return scraped;
}

async function processFile(fileName: string) {
    const links = await readIndexURL(fileName);
    const browser = await Puppeteer.launch({ headless: false });

    const results = [];
    for (const link of links) {
        const res = await fetchURL(browser, link.trim());
        if (res) results.push(res);
    }

    const filtered = results.filter(notNull) as string[][];
    const outFile = `${fileName.replace('.txt', '')}.csv`;
    await writeCSV(filtered, outFile);
}

function processArgs() {
    const argv = process.argv.slice(2);
    if (!argv.length) return false;
    return argv.map((item) => path.join(process.cwd(), item));
}

async function main() {
    const args = processArgs();
    if (!args) return Logger.error('Not enough args');
    for (const arg of args) {
        await processFile(arg);
    }
}

main();

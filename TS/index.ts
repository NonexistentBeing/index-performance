import Puppeteer, { Browser } from 'puppeteer';
import { Logger, LogLevel } from './logger';
import {
    ScrapeFun,
    scrapeFunctions,
    scrapeHeadFunctions,
} from './Scrape/scrapeFunctions';
import { processFile, setupFs, writeCSV } from './FSUtil/util';
import path from 'path';

// Utility functions
function notNull(val: any) {
    return val !== null;
}

function setup() {
    Logger.setLevel(LogLevel.Error);
    setupFs(process.argv[2]);
}

// Puppeteer functions

async function fetchURL(browser: Browser, url: string, scrapeFun: ScrapeFun) {
    const page = await browser.newPage();
    await page.goto(url);

    const scraped = await scrapeFun(page);
    await page.close();
    return scraped;
}

async function scrape(fileName: string) {
    const browser = await Puppeteer.launch({ headless: false });
    const linkObj = await processFile(fileName);

    for (const host in linkObj) {
        const results: Array<string[] | null> = [];
        const scrapeFun = scrapeFunctions[host];

        if (!scrapeFun) {
            Logger.error(`Host "${host}" is not supported`);
            continue;
        }

        const scrapeHead = scrapeHeadFunctions[host];
        if (scrapeHead) {
            const head = await await fetchURL(
                browser,
                linkObj[host][0].trim(),
                scrapeHead
            );
            results.push(head);
        }

        for (const link of linkObj[host]) {
            const res = await fetchURL(browser, link.trim(), scrapeFun);
            if (res) results.push(res);
        }

        const filtered = results.filter(notNull) as string[][];
        const outFile = path.join(
            process.argv[2],
            `${fileName.replace('.txt', '')}-${host}.csv`
        );
        const result = await writeCSV(filtered, outFile);

        if (!result) {
            Logger.warn(`Could not write to file ${outFile}`);
        } else {
            Logger.info(`Successfully wrote to ${outFile}`);
        }
    }

    browser.close();
}

function processArgs() {
    const argv = process.argv.slice(3);
    if (!argv.length) return false;
    return argv;
}

async function main() {
    setup();

    const args = processArgs();
    if (!args) return Logger.error('Not enough args');
    for (const arg of args) {
        await scrape(arg);
    }
}

main();

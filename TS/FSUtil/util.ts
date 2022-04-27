import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import { Logger } from '../logger';

// SETUP FUNCTION
export function setupFs(dirname: string) {
    if (!fs.existsSync(dirname)) {
        Logger.info(`Creating output directory "${dirname}"`);
        fs.mkdirSync(dirname, { recursive: true });
    }
}

// CSV functions
function validateArrayCSV<T>(arr: T[][]) {
    const len = arr[0]?.length;
    return (
        len && arr.reduce((carry, item) => carry && item.length == len, true)
    );
}

export async function writeCSV(
    arr: string[][],
    fileName: string = './out.csv'
) {
    if (!validateArrayCSV(arr)) return false;
    const csv = arr.map((item) => item.join(', ')).join('\n');
    await writeFile(fileName, csv, {});
    return true;
}

// Functions to process files
type LinkObject = {
    [hostname: string]: string[];
};

function reducer(carry: LinkObject, currentURL: string) {
    const { hostname } = new URL(currentURL);
    if (!(hostname in carry)) carry[hostname] = [];
    carry[hostname].push(currentURL);
    return carry;
}

export async function processFile(fileName: string) {
    Logger.info(`Reading file ${fileName}`);
    let rawLinks = await readFile(fileName);
    const links = rawLinks.toString().replace(/\s+/gi, '\n').split('\n');
    return links.reduce(reducer, {} as LinkObject);
}

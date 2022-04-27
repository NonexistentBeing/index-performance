import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';

export function setupFs() {
    if (!fs.existsSync('./out')) {
        fs.mkdirSync('./out');
    }
}

export async function readIndexURL(fileName: string) {
    const file = await readFile(fileName);
    return file.toString().replace(/\s+/gi, '\n').split('\n');
}

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
    const csv = arr.map((item) => item.join(',')).join('\n');
    writeFile(fileName, csv);
}

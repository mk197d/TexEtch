import * as fs from 'fs';
import { Data } from '../interfaces/Data';

export function readJsonFile(filePath: string): Data {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

export function writeToFile(outPath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(outPath, data, { flag: 'a' }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}





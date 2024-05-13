import * as fs from 'fs';

export function xmlRead(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file: ${err}`);
            } else {
                resolve(data);
            }
        });
    });
}
import * as fs from 'fs';

export function jsonWrite(filePath: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(`Error writing file: ${err}`);
            } else {
                resolve();
            }
        });
    });
}
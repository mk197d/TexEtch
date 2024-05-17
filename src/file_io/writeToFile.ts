import * as fs from 'fs';

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





import fs from 'fs';
import path from 'path';

export const readFile = (filePath, bin = false) =>
    fs.readFileSync(filePath, bin ? null : 'utf8');

export const writeFile = (filePath, data, bin = false) =>
    fs.writeFileSync(filePath, data, bin ? null : 'utf8');

export const walkDir = (pathToWalk, cb) =>
    fs.readdirSync(pathToWalk).forEach((filePath) => {
        const fullFilePath = `${pathToWalk}${path.sep}${filePath}`;
        const stat = fs.statSync(fullFilePath);

        if (stat.isFile()) {
            cb(fullFilePath);
        } else {
            walkDir(fullFilePath, cb);
        }
    });

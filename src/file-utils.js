import fs from 'fs';
import path from 'path';

export const existsFile = (filePath) => {
    try {
        return fs.statSync(filePath);
    } catch (e) {
        return false;
    }
};

export const readFile = (filePath, bin = false) =>
    fs.readFileSync(filePath, bin ? null : 'utf8');

export const writeFile = (filePath, data, bin = false) => {
    mkDirRecursively(path.dirname(filePath));
    fs.writeFileSync(filePath, data, bin ? null : 'utf8');
};

const mkDirRecursively = (folderPath) => {
    let stat = existsFile(path.dirname(folderPath));

    if (!stat) {
        mkDirRecursively(path.dirname(folderPath));
    }
    stat = existsFile(folderPath);

    if (!stat) {
        fs.mkdirSync(folderPath);
    } else if (stat.isFile()) {
        throw `Found file on ${folderPath} while creating a folder`;
    }
};

export const walkDir = (pathToWalk, cb) => {
    let stat = existsFile(pathToWalk);

    if (!stat || stat.isFile()) {
        return;
    }

    fs.readdirSync(pathToWalk).forEach((filePath) => {
        const fullFilePath = `${pathToWalk}${path.sep}${filePath}`;
        stat = fs.statSync(fullFilePath);

        if (stat.isFile()) {
            cb(fullFilePath, false);
        } else if (stat.isDirectory()) {
            walkDir(fullFilePath, cb);
        }
    });

    cb(pathToWalk, true);
};

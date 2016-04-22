import fs from 'fs';
import { readFile, walkDir } from '../src/file-utils';

export const getTestFileContent = (path, bin = null) =>
    readFile(`test/files/${path}`, bin);

export const getTestPath = (aPath) => `test/files/${aPath}`;

export const removeTmpFolder = () => {
    walkDir('test/files/tmp', (file, isFolder) => {
        if (isFolder) {
            fs.rmdirSync(file);
        } else {
            fs.unlinkSync(file);
        }
    });
};

import fs from 'fs';
import { walkDir } from '../src/file-utils';

export const getTestFileContent = (path, bin = null) =>
    fs.readFileSync(`test/files/${path}`, bin ? null : 'utf8');

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

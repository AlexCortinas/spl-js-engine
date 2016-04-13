import fs from 'fs';
import { walkDir } from '../src/file-utils';

export const getTestFileContent = (path, bin = null) =>
    fs.readFileSync(`test/files/${path}`, bin ? null : 'utf8');

export const getTestPath = (aPath) => `test/files/${aPath}`;

export const createTmpFolder = () => {
    fs.mkdirSync('test/files/tmp');
};

export const removeTmpFolder = () => {
    walkDir('test/files/tmp', (file) => fs.unlinkSync(file));
    fs.rmdirSync('test/files/tmp');
};

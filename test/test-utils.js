import fs from 'fs';

export const getTestFileContent = (path, bin = null) => fs.readFileSync(`test/files/${path}`, bin ? null : 'utf8');
export const getTestPath = (aPath) => `test/files/${aPath}`;

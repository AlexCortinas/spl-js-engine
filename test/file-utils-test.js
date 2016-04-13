import assert from 'assert';

import {
    readFile, writeFile, walkDir
} from '../src/file-utils';

import {
    createTmpFolder, getTestPath as p, removeTmpFolder
} from './test-utils';

suite('File Utils');

before(createTmpFolder);
after(removeTmpFolder);

test('Testing readFile', () => {
    assert.strictEqual(readFile(p('asdf.txt')), 'asdf\n');
});

test('Walking directory', () => {
    const result = [];
    const expected = [
        p('dir-to-walk/foo/a'),
        p('dir-to-walk/foo/b'),
        p('dir-to-walk/foo/c/d'),
        p('dir-to-walk/ignore/e')
    ];
    walkDir(p('dir-to-walk'), (filePath) => result.push(filePath));
    assert.deepEqual(result, expected);
});

test('Testing writeFile', () => {
    writeFile(p('tmp/asdf.txt'), 'asdf\n');
    assert.strictEqual(readFile(p('tmp/asdf.txt')), 'asdf\n');
});

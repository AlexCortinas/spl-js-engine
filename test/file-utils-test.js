import assert from 'assert';

import {
    existsFile, readFile, walkDir, writeFile
} from '../src/file-utils';

import {
    getTestPath as p, removeTmpFolder
} from './test-utils';

suite('File Utils');

before(removeTmpFolder);

test('Testing existsFile', () => {
    assert.notEqual(existsFile(p('asdf.txt')), false);
});

test('Testing readFile', () => {
    assert.strictEqual(readFile(p('asdf.txt')), 'asdf\n');
});

test('Walking directory', () => {
    const result = [];
    const expected = [
        p('dir-to-walk/foo/a'),
        p('dir-to-walk/foo/b'),
        p('dir-to-walk/foo/c/d'),
        p('dir-to-walk/foo/c'),
        p('dir-to-walk/foo'),
        p('dir-to-walk/ignore/e'),
        p('dir-to-walk/ignore'),
        p('dir-to-walk')
    ];
    walkDir(p('dir-to-walk'), (filePath) => result.push(filePath));
    assert.deepEqual(result, expected);
});

test('Testing writeFile', () => {
    writeFile(p('tmp/tmp/asdf.txt'), 'asdf\n');
    writeFile(p('tmp/asdf.txt'), 'asdf\n');
    assert.strictEqual(readFile(p('tmp/tmp/asdf.txt')), 'asdf\n');
    assert.strictEqual(readFile(p('tmp/asdf.txt')), 'asdf\n');
});

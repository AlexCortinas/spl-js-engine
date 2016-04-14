import assert from 'assert';

import { DerivationEngine } from '../src/index';

import {
    getTestFileContent as f, getTestPath as p, removeTmpFolder
} from './test-utils';

suite('Derivation Engine');

before(removeTmpFolder);

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine();

    engine.generateProject(p('simpleSPL/code'), p('tmp/simpleProduct'));

    assert.strictEqual(f('simpleSPL/code/index.html'), f('tmp/simpleProduct/index.html'));
    assert.strictEqual(f('simpleSPL/code/main.js'), f('tmp/simpleProduct/main.js'));
});

test('Create a project', () => {
    const engine = new DerivationEngine();

    engine.addDelimiter(['html', 'xml'], '<!--%', '-->');
    engine.addDelimiter('py', '#%', '%#');
});

import assert from 'assert';

import { DerivationEngine } from '../src/index';

import {
    getTestFileContent as f, getTestPath as p, removeTmpFolder
} from './test-utils';

suite('Derivation Engine');

before(removeTmpFolder);

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine();

    engine.generateProject(p('simpleSPL'), p('tmp/simpleSPL'));

    assert.strictEqual(f('simpleSPL/index.html'), f('tmp/simpleSPL/index.html'));
    assert.strictEqual(f('simpleSPL/main.js'), f('tmp/simpleSPL/main.js'));
});

test('Create a project', () => {
    const engine = new DerivationEngine();

    engine.addDelimiter('html', '<!--%', '-->');
    engine.addDelimiter('py', '#%', '%#');
    engine.setFeatures([ 'featureA', 'featureB' ]);
    engine.setData({ 'propA': 'one', 'propB': 23 });
});

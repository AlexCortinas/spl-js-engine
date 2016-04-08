/* global suite */
/* global test */

import assert from 'assert';

import { DerivationEngine } from '../src/index';
import { getTestFileContent as f, getTestPath as p } from './test-utils';

suite('Derivation Engine');

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine();

    engine.generateProject(p('simpleSPL'), p('tmp/simpleSPL'));

    assert.strictEqual(f('simpleSPL/index.html'), f('tmp/simpleSPL/index.html'));
    assert.strictEqual(f('simpleSPL/main.js'), f('tmp/simpleSPL/main.js'));
});

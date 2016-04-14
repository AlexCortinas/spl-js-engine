import assert from 'assert';

import { DerivationEngine, readJsonFromFile } from '../src/index';

import {
    getTestFileContent as f, getTestPath as p, removeTmpFolder
} from './test-utils';

suite('Derivation Engine');

beforeEach(removeTmpFolder);

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine();

    engine.generateProject(p('simpleSPL/code'), p('tmp/simpleProduct'));

    assert.strictEqual(f('simpleSPL/code/index.html'), f('tmp/simpleProduct/index.html'));
    assert.strictEqual(f('simpleSPL/code/main.js'), f('tmp/simpleProduct/main.js'));
});

test('Create a project', () => {
    const engine = new DerivationEngine();

    engine.setFeatureModel(readJsonFromFile(p('simpleSPL/model.yaml')));
    engine.setConfig(readJsonFromFile(p('simpleSPL/config.yaml')));
    engine.setProject(readJsonFromFile(p('simpleSPL/project.yaml')));

    engine.generateProject(p('simpleSPL/code'), p('tmp/simpleProduct'));
});

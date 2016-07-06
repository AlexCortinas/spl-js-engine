import assert from 'assert';

import { DerivationEngine, readJsonFromFile } from '../src/index';

import {
    getTestPath as p, removeTmpFolder,
    assertEqualFilesInFolders
} from './test-utils';

suite('Derivation Engine');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine(p('simpleSPL/code'));

    engine.generateProject(p('tmp/simpleProduct'));

    assertEqualFilesInFolders(p('simpleSPL/code'), p('tmp/simpleProduct'));
});

test('Trying to create a project without code path', () => {
    assert.throws(() => {
        new DerivationEngine();
    }, /Code path is required to create a Derivation Engine/);
});

test('Create a project', () => {
    const engine = new DerivationEngine(
        p('simpleSPL/code'),
        readJsonFromFile(p('simpleSPL/model.yaml')),
        readJsonFromFile(p('simpleSPL/config.yaml'))
    );

    engine.generateProject(
        p('tmp/simpleProduct'),
        readJsonFromFile(p('simpleSPL/project.yaml'))
    );

    assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
});

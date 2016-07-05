import { DerivationEngine, readJsonFromFile } from '../src/index';

import {
    getTestPath as p, removeTmpFolder,
    assertEqualFilesInFolders
} from './test-utils';

suite('Derivation Engine');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Create a project without feature selection or any custom data', () => {
    const engine = new DerivationEngine();

    engine.generateProject(p('simpleSPL/code'), p('tmp/simpleProduct'));

    assertEqualFilesInFolders(p('simpleSPL/code'), p('tmp/simpleProduct'));
});

test('Create a project', () => {
    const engine = new DerivationEngine();

    engine.setFeatureModel(readJsonFromFile(p('simpleSPL/model.yaml')));
    engine.setConfig(readJsonFromFile(p('simpleSPL/config.yaml')));
    engine.setProject(readJsonFromFile(p('simpleSPL/project.yaml')));

    engine.generateProject(p('simpleSPL/code'), p('tmp/simpleProduct'));

    assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
});

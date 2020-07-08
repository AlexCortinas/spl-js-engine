import {DerivationEngine, readJsonFromFile} from '../src/index';
import {getTestPath as p, removeTmpFolder, assertEqualFilesInFolders} from './test-utils';

suite('#FileGeneration - checks that using zip or local files is the sames');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Destructuring parameters', () => {
  const engine = new DerivationEngine({
    codePath: p('simpleSPL/code'),
    featureModel: readJsonFromFile(p('simpleSPL/model.json')),
    config: readJsonFromFile(p('simpleSPL/config.json'))
  });

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPL/product.json'))
  );

  assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
});

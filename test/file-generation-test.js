import {DerivationEngine, readJsonFromFile, readFile} from '../src/index';
import {getTestPath as p, removeTmpFolder, assertEqualFilesInFolders} from './test-utils';
import JSZip from 'jszip';

suite('#FileGeneration - checks that using zip or local files is the sames');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Destructuring parameters', async () => {
  const engine = await new DerivationEngine({
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

test('Generate local from zip', (done) => {
  JSZip.loadAsync(readFile(p('simpleSPL.zip'), true)).then((zip) => {
    new DerivationEngine({
      zip,
      featureModel: 'model.json'
    }).then((engine) => {
      engine.generateProduct(
        p('tmp/simpleProduct'),
        readJsonFromFile(p('simpleSPL/product.json'))
      ).then(() => {
        assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
        done();
      });
    });
  }).catch(e => done(e));
});

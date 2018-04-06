import assert from 'assert';
import {DerivationEngine, readJsonFromFile, readFile} from '../src/index';
import {getTestPath as p, removeTmpFolder, assertEqualFilesInFolders} from './test-utils';

suite('#DerivationEngine');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Create a product without feature selection or any custom data', () => {
  const engine = new DerivationEngine(p('simpleSPL/code'));

  engine.generateProduct(p('tmp/simpleProduct'));

  assertEqualFilesInFolders(p('simpleSPL/code'), p('tmp/simpleProduct'));
});

test('Create a product', () => {
  const engine = new DerivationEngine(
    p('simpleSPL/code'),
    readJsonFromFile(p('simpleSPL/model.json')),
    readJsonFromFile(p('simpleSPL/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPL/product.json'))
  );

  assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
});

test('Create a product with data', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithData/code'),
    readJsonFromFile(p('simpleSPLwithData/model.json')),
    readJsonFromFile(p('simpleSPLwithData/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPLwithData/product.json'))
  );

  assertEqualFilesInFolders(
    p('simpleSPLwithData/expected'), p('tmp/simpleProduct'));
});

test('Create a product and use some extra js function', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithExtraJS/code'),
    readJsonFromFile(p('simpleSPLwithExtraJS/model.json')),
    readJsonFromFile(p('simpleSPLwithExtraJS/config.json')),
    readFile(p('simpleSPLwithExtraJS/js.js'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPLwithExtraJS/product.json'))
  );

  assertEqualFilesInFolders(p('simpleSPLwithExtraJS/expected'), p('tmp/simpleProduct'));
});

test('Get features and parameters of an annotated project', () => {
  const engine = new DerivationEngine(p('simpleSPLwithData/code'));

  engine.setConfig(readJsonFromFile(p('simpleSPLwithData/config.json')));

  const report = engine.analyseAnnotations();

  assert.deepEqual(
    report.short(),
    {
      feature: {featureA: 2, featureB: 1, featureC: 1},
      data: {aValue: 1, bValue: 1}
    }
  );

  assert.deepEqual(
    report.long(),
    {
      'index.html': {
        feature: {featureA: 1, featureB: 1, featureC: 1},
        data: {}
      },
      'main.js': {
        feature: {featureA: 1},
        data: {aValue: 1, bValue: 1}
      }
    }
  );

  assert.deepEqual(
    report.filesByFeature('featureA'),
    ['index.html', 'main.js']
  );

  assert.deepEqual(
    report.filesByFeature('featureB'),
    ['index.html']
  );

  assert.deepEqual(
    report.filesByData('aValue'),
    ['main.js']
  );
});

test('Compare feature model vs analysed code results', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithData/code'),
    readJsonFromFile(p('simpleSPLwithData/model.json')),
    readJsonFromFile(p('simpleSPLwithData/config.json'))
  );

  const report = engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {errors: 0, warnings: 0, abound: [], missing: []}
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwithData/product.json'))
    ),
    {errors: 0, warnings: 0, abound: [], missing: []}
  );
});


test('Compare fanalysis results in a not consistent project', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwrong/code'),
    readJsonFromFile(p('simpleSPLwrong/model.json')),
    readJsonFromFile(p('simpleSPLwrong/config.json'))
  );

  const report = engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {
      errors: 2, warnings: 1,
      abound: ['featureWrong', 'anotherFeatureWrong'],
      missing: ['featureA']
    }
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwrong/product.json'))
    ),
    {
      errors: 2, warnings: 1,
      abound: ['wrongValue', 'anotherWrongValue'],
      missing: ['aValue']
    }
  );
});

test('Create a product with data parameters at several levels', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithDataComplex/code'),
    readJsonFromFile(p('simpleSPLwithDataComplex/model.json')),
    readJsonFromFile(p('simpleSPLwithDataComplex/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPLwithDataComplex/product.json'))
  );

  assertEqualFilesInFolders(
    p('simpleSPLwithDataComplex/expected'), p('tmp/simpleProduct'));
});

test('Consistency results for complex data', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithDataComplex/code'),
    readJsonFromFile(p('simpleSPLwithDataComplex/model.json')),
    readJsonFromFile(p('simpleSPLwithDataComplex/config.json'))
  );

  const report = engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {errors: 0, warnings: 0, abound: [], missing: []}
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwithDataComplex/product.json'))
    ),
    {errors: 0, warnings: 0, abound: [], missing: []}
  );
});

test('Checking "binarity" of unknown extensions not in config', () => {
  const engine = new DerivationEngine(
    p('checkBinary/code'),
    readJsonFromFile(p('checkBinary/model.json')),
    readJsonFromFile(p('checkBinary/config.json'))
  );

  engine.generateProduct(
    p('tmp/checkBinary'),
    readJsonFromFile(p('checkBinary/product.json'))
  );

  assertEqualFilesInFolders(p('checkBinary/expected'), p('tmp/checkBinary'));
});

test('Avoid checking "binarity" of extensions in config', () => {
  const engine = new DerivationEngine(
    p('checkBinary/code'),
    readJsonFromFile(p('checkBinary/model.json')),
    readJsonFromFile(p('checkBinary/config-including.json'))
  );

  engine.generateProduct(
    p('tmp/checkBinary'),
    readJsonFromFile(p('checkBinary/product.json'))
  );

  assertEqualFilesInFolders(p('checkBinary/expected-including'), p('tmp/checkBinary'));
});

suite('#DerivationEngine: Analysis tools');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Get files with more features involved', () => {
  const engine = new DerivationEngine(
    'examples/GPL/GraphProductLine',
    readJsonFromFile('examples/GPL/model.json'),
    readJsonFromFile('examples/GPL/config.json')
  );

  const report = engine.analyseAnnotations();

  // TODO make a properly test
  report.short();
  report.long();
  report.filesByFeature('weighted');
  report.filesByFeatureLong('weighted', true);
  // fails on windows due to the separation /
  //report.featuresByFile('src/gpl/graph/Graph.java', true);
  report.filesByData('asdf');
  report.listFeatures(true);
  report.listFiles(true);
});

suite('#DerivationEngine: Generation of files');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('From list of strings with nesting', () => {
  const engine = new DerivationEngine(
    p('spl-generate/code'),
    readJsonFromFile(p('spl-generate/model.json')),
    readJsonFromFile(p('spl-generate/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('spl-generate/product.json'))
  );

  assertEqualFilesInFolders(p('spl-generate/expected'), p('tmp/simpleProduct'));
});

test('Create folder', () => {
  const engine = new DerivationEngine(
    p('spl-generate-folder/code'),
    readJsonFromFile(p('spl-generate-folder/model.json')),
    readJsonFromFile(p('spl-generate-folder/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('spl-generate-folder/product.json'))
  );

  assertEqualFilesInFolders(p('spl-generate-folder/expected'), p('tmp/simpleProduct'));
});

test('Checking escape of first character of end delimiter', () => {
  const engine = new DerivationEngine(
    p('spl-generate-escape/code'),
    readJsonFromFile(p('spl-generate-escape/model.json')),
    readJsonFromFile(p('spl-generate-escape/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('spl-generate-escape/product.json'))
  );

  assertEqualFilesInFolders(p('spl-generate-escape/expected'), p('tmp/simpleProduct'));
});

test('Omitting empty files', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithEmptyFiles/code'),
    readJsonFromFile(p('simpleSPLwithEmptyFiles/model.json')),
    readJsonFromFile(p('simpleSPLwithEmptyFiles/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPLwithEmptyFiles/product.json'))
  );

  assertEqualFilesInFolders(p('simpleSPLwithEmptyFiles/expected'), p('tmp/simpleProduct'));
});

test('Omitting empty files with double annotation', () => {
  const engine = new DerivationEngine(
    p('simpleSPLwithEmptyFiles2/code'),
    readJsonFromFile(p('simpleSPLwithEmptyFiles2/model.json')),
    readJsonFromFile(p('simpleSPLwithEmptyFiles2/config.json'))
  );

  engine.generateProduct(
    p('tmp/simpleProduct'),
    readJsonFromFile(p('simpleSPLwithEmptyFiles2/product.json'))
  );

  assertEqualFilesInFolders(p('simpleSPLwithEmptyFiles2/expected'), p('tmp/simpleProduct'));
});

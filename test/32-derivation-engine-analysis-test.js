import assert from 'assert';
import {DerivationEngine, readJsonFromFile} from '../src/index.js';
import {getTestPath as p, removeTmpFolder} from './test-utils.js';

suite('#DerivationEngine: Analysis tools');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Get features and parameters of an annotated project', async () => {
  const engine = await new DerivationEngine(p('simpleSPLwithData/code'));

  engine.setConfig(readJsonFromFile(p('simpleSPLwithData/config.json')));

  const report = await engine.analyseAnnotations();

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

test('Compare feature model vs analysed code results', async () => {
  const engine = await new DerivationEngine(
    p('simpleSPLwithData/code'),
    readJsonFromFile(p('simpleSPLwithData/model.json')),
    readJsonFromFile(p('simpleSPLwithData/config.json'))
  );

  const report = await engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {
      surplus: {
        desc: 'features found in code but not in feature model',
        values: [],
        count: 0
      },
      missing: {
        desc: 'child features found in feature model but not in code',
        values: [],
        count: 0
      }
    }
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwithData/product.json'))
    ),
    {errors: 0, warnings: 0, surplus: [], missing: []}
  );
});

test('Compare fanalysis results in a not consistent project', async () => {
  const engine = await new DerivationEngine(
    p('simpleSPLwrong/code'),
    readJsonFromFile(p('simpleSPLwrong/model.json')),
    readJsonFromFile(p('simpleSPLwrong/config.json'))
  );

  const report = await engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {
      surplus: {
        desc: 'features found in code but not in feature model',
        values: ['featureWrong', 'anotherFeatureWrong'],
        count: 2
      },
      missing: {
        desc: 'child features found in feature model but not in code',
        values: ['featureA'],
        count: 1
      }
    }
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwrong/product.json'))
    ),
    {
      errors: 2, warnings: 1,
      surplus: ['wrongValue', 'anotherWrongValue'],
      missing: ['aValue']
    }
  );
});

test('Consistency results for complex data', async () => {
  const engine = await new DerivationEngine(
    p('simpleSPLwithDataComplex/code'),
    readJsonFromFile(p('simpleSPLwithDataComplex/model.json')),
    readJsonFromFile(p('simpleSPLwithDataComplex/config.json'))
  );

  const report = await engine.analyseAnnotations();

  assert.deepEqual(
    report.checkAnnotatedFeaturesConsistency(),
    {
      surplus: {
        desc: 'features found in code but not in feature model',
        values: [],
        count: 0
      },
      missing: {
        desc: 'child features found in feature model but not in code',
        values: [],
        count: 0
      }
    }
  );

  assert.deepEqual(
    report.checkAnnotatedDataConsistency(
      readJsonFromFile(p('simpleSPLwithDataComplex/product.json'))
    ),
    {errors: 0, warnings: 0, surplus: [], missing: []}
  );
});

test('Get files with more features involved', async () => {
  const engine = await new DerivationEngine(
    'examples/GPL/GraphProductLine',
    readJsonFromFile('examples/GPL/model.json'),
    readJsonFromFile('examples/GPL/config.json')
  );

  const report = await engine.analyseAnnotations();

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

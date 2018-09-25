import meow from 'meow';
import fs from 'fs';
import path from 'path';
import {DerivationEngine, readJsonFromFile, readFile} from './index';

export function cli() {
  const cli = meow({help: false});
  const {
    featureModel,
    product,
    config,
    code,
    extra,
    output = 'output',
    modelTransformation = null,
    verbose = false
  } = cli.flags;

  if (cli.flags.help || !code || !featureModel) {
    console.log(
      fs.readFileSync(
        path.join(__dirname, '../usage.txt'), 'utf8')
    );
    process.exit(0);
  }

  let configJson = {};
  if (config) {
    configJson = readJsonFromFile(config);
  }

  let evaluedMT = null;
  if (modelTransformation) {
    evaluedMT = eval(readFile(modelTransformation));
  }

  const engine = new DerivationEngine(code, readFile(featureModel), configJson, readFile(extra), evaluedMT, verbose);

  let productJson = {};
  if (product) {
    productJson = readJsonFromFile(product);
  }

  if (cli.input.indexOf('validate') != -1) {
    validate(engine, productJson);
  }

  engine.generateProduct(output, productJson);
  console.log(`Product generated at ${output}`);
}

function validate(engine, productJson) {
  const report = engine.analyseAnnotations();
  const featuresConsistency = report.checkAnnotatedFeaturesConsistency();
  const dataConsistency = report.checkAnnotatedDataConsistency(productJson);

  if (featuresConsistency.errors || dataConsistency.errors) {
    console.log('Inconsistency errors!');
    console.log('============================');
    console.log('Features consistency:');
    console.log(featuresConsistency);
    console.log('============================');
    console.log('Data parameters consistency:');
    console.log(dataConsistency);
    console.log('============================');
    return;
  } else if (featuresConsistency.warnings || dataConsistency.warnings) {
    console.log('Inconsistency warnings!');
    console.log('============================');
    console.log('Features consistency:');
    console.log(featuresConsistency);
    console.log('============================');
    console.log('Data parameters consistency:');
    console.log(dataConsistency);
    console.log('============================');
  }
}

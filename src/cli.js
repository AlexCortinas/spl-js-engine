import meow from 'meow';
import fs from 'fs';
import path from 'path';

import { DerivationEngine, readJsonFromFile, readFile } from './index';

export function cli() {
    const cli = meow({ help: false });
    const {
        featureModel,
        product,
        config,
        code,
        output = 'output'
    } = cli.flags;

    if (cli.flags.help || !code || !featureModel) {
        console.log(
            fs.readFileSync(
                path.join(__dirname, '../usage.txt'), 'utf8')
            );
        process.exit(0);
    }

    let featureModelJson = readJsonFromFile(featureModel);
    if (!featureModelJson) {
        featureModelJson = readFile(featureModel);
    }

    let configJson = {};
    if (config) {
        configJson = readJsonFromFile(config);
    }

    const engine = new DerivationEngine(code, featureModelJson, configJson);

    let productJson = {};
    if (product) {
        productJson = readJsonFromFile(product);
    }

    engine.generateProduct(output, productJson);
}

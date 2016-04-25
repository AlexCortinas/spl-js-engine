import meow from 'meow';
import fs from 'fs';
import path from 'path';

import { DerivationEngine, readJsonFromFile, readFile } from './index';

export function cli() {
    const cli = meow({ help: false });
    const {
        featureModel,
        project,
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

    const engine = new DerivationEngine();

    const featureModelJson = readJsonFromFile(featureModel);
    if (featureModelJson) {
        engine.setFeatureModel(featureModelJson);
    } else {
        engine.setFeatureModel(readFile(featureModel));
    }

    if (config) {
        engine.setConfig(readJsonFromFile(config));
    }

    if (project) {
        engine.setProject(readJsonFromFile(project));
    }

    engine.generateProject(code, output);
}

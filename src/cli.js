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

    let featureModelJson = readJsonFromFile(featureModel);
    if (!featureModelJson) {
        featureModelJson = readFile(featureModel);
    }

    let configJson = {};
    if (config) {
        configJson = readJsonFromFile(config);
    }

    const engine = new DerivationEngine(code, featureModelJson, configJson);

    let projectJson = {};
    if (project) {
        projectJson = readJsonFromFile(project);
    }

    engine.generateProject(output, projectJson);
}

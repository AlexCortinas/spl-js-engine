import meow from 'meow';
import fs from 'fs';
import path from 'path';

import { DerivationEngine, readJsonFromFile } from './index';

export function cli() {
    console.log('Running cli');

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
                path.join(__dirname, '../usage.txt'), 'utf8'),
                _getCommandExecuted()
            );
        process.exit(0);
    }

    const engine = new DerivationEngine();

    engine.setFeatureModel(readJsonFromFile(featureModel));

    if (config) {
        engine.setConfig(readJsonFromFile(config));
    }

    if (project) {
        engine.setProject(readJsonFromFile(project));
    }

    engine.generateProject(code, output);
}

function _getCommandExecuted() {
    return `${process.argv[0]} ${process.argv[1]}`;
}

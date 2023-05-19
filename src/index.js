#!/usr/bin/env node

export {default as DerivationEngine} from './derivation-engine.js';
export {default as FeatureModel} from './feature-model/feature-model.js';
export {default as TemplateEngine} from './template-engine/template-engine.js';

export {readJsonFromFile, readFile} from './file-utils.js';

import {cli} from './cli.js';
import path from "path";

const runningAsScript = import.meta.url.endsWith(path.basename(process.argv[1]));
if (runningAsScript) cli();

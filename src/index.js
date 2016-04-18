#!/usr/bin/env babel-node

export { DerivationEngine } from './derivation-engine';
export { readJsonFromFile } from './file-utils';
export { FeatureModel } from './feature-model/feature-model';

import { cli } from './cli';

if (require.main === module) cli();

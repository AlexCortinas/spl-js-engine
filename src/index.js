#!/usr/bin/env babel-node

export { DerivationEngine } from './derivation-engine';
export { readJsonFromFile } from './file-utils';

import { cli } from './cli';

if (require.main === module) cli();

#!/usr/bin/env babel-node

export { DerivationEngine } from './derivation-engine';

if (require.main === module) {
    console.log('Running cli');
}

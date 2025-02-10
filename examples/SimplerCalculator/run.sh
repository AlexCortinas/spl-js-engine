#! /usr/bin/env bash

npx spl-js-engine --featureModel model.uvl --product product.json --config config.json --extra extra.js --code code --output output
npx spl-js-engine --featureModel model.uvl  --product product.json --config config.json --extra extra.js --code code --output output --outputType zip

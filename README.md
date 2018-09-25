# spl-js-engine
Software Product Line JavaScript Derivation Engine

## Requirements

* Node (> v6.9.4)
* NPM (> 3.10.10)

## Instructions

* `npm install`: Installation.
* `[sudo] npm link`: Globally link the client so `spl-js-engine` can be run.
* `npm test`: Run all test.
* `spl-js-engine help`: Usage page.

## Examples

### My Calculator

A simple web-based calculator made with Spring Boot and Angular

Generation of the product:

```
cd examples/MyCalculator
spl-js-engine --featureModel model.json \
    --product product.json \
    --config config.json \
    --extra extra.js \
    --code code \
    --output output
    [--verbose]
```

Running the generated product:

```bash
cd output
npm install
mvn spring-boot:run

# open http://localhost:8080/ on any web browser
```

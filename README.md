# spl-js-engine
Software Product Line JavaScript Derivation Engine

## Requirements

* Node (> v6.9.4)
* NPM (> 3.10.10)

## Installation

### With npm

In the local folder/project: `npm install spl-js-engine [--save-dev]`

Global installation: `npm install spl-js-engine --location=global`

Running it: `npx spl-js-engine help`

### From github

* `git clone https://github.com/AlexCortinas/spl-js-engine.git`: Clone the repo
* `npm install`: Installation.
* `npm test`: Run all tests.
* `[sudo] npm link`: Globally link the client so `spl-js-engine` can be run anywhere.
* `npx spl-js-engine help`: Usage page.

### Documentation

Check the [wiki](https://github.com/AlexCortinas/spl-js-engine/wiki).

## Examples (github)

### My Calculator

A simple web-based calculator made with Spring Boot and Angular

Generation of the product:

```bash
cd examples/MyCalculator
npx spl-js-engine --featureModel model.json \
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

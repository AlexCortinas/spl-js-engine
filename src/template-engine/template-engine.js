import Processor from './processor';

export default class TemplateEngine {
    constructor() {
        this.delimiters = {};
    }

    createProcessor(features, data) {
        return new Processor(features, data, this.delimiters);
    }
}

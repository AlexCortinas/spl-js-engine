import Processor from './processor';
import Delimiter from './delimiter';
import Analyser from './analyser';

export default class TemplateEngine {
    constructor({ startDelimiter, endDelimiter } = {}) {
        this.delimiters = {};
        if (startDelimiter && endDelimiter) {
            this.addDelimiter('default', startDelimiter, endDelimiter);
        }
    }

    createProcessor(features, data) {
        return new Processor(features, data, this.delimiters);
    }

    createAnalyser() {
        return new Analyser(this.delimiters);
    }

    addDelimiter(type, start, end) {
        this.delimiters[type] = new Delimiter(start, end);
    }
}

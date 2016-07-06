import Delimiter from './delimiter.js';

export default class DelimiterAwareEntity {
    constructor(delimiters = {}) {
        this.delimiters = delimiters;
        if (!this.delimiters.default) {
            this.delimiters.default = new Delimiter();
        }
    }

    getDelimiter(extension = 'default') {
        if (this.delimiters[extension])
            return this.delimiters[extension];
        else
            return this.delimiters.default;
    }
}

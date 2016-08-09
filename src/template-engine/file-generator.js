import Engine from './engine.js';

export default class FileGenerator extends Engine {
    constructor(features = {}, data = {}, delimiters = {}) {
        super(delimiters);
        this.features = features;
        this.data = data;
    }

    filesToCreate(fileContent, extension, fileName, context) {
        const delimiter = this.getDelimiter(extension).header;
        const match = delimiter.exec(fileContent);

        if (!match) {
            return [ { fileContent, fileName, context } ];
        } else {
            const f = new Function('feature', 'data', 'fileName', 'context',
                this.getTemplateHelperMethods() + match[1]);
            const fresults = f(this.features, this.data, fileName, context);
            const newFileContent = fileContent.replace(delimiter, '').replace(/^[\n\r\t]/, '');
            return flatten(fresults.map(r => this.filesToCreate(newFileContent, extension, r.fileName, r.context)));
        }
    }
}

function flatten(list) {
    return list.reduce((a, b) => (Array.isArray(b) ? a.push(...flatten(b)) : a.push(b), a), []);
}

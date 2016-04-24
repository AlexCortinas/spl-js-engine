import Delimiter from './delimiter.js';

export default class Processor {
    constructor(features = {}, data = {}, delimiters = {}) {
        this.features = features;
        this.data = data;
        this.delimiters = delimiters;
        if (!this.delimiters.default) {
            this.delimiters.default = new Delimiter();
        }
    }

    getDelimiter(extension = 'default') {
        return this.delimiters[extension];
    }

    process(str, ext) {
        let code = 'var lines = [];\n';
        let cursor = 0;
        let match;
        const delimiter = this.getDelimiter(ext).regular;
        
        while ((match = delimiter.exec(str)) !== null) {
            code += _newLine(str.slice(cursor, match.index));
            if (match[1] === '\n') {
                // javascriptExpression is 'full-line' and starts at
                // beginning of line, we should add the newline taken by regexp
                code += 'r.push("\\n");\n';
            }
            code += _newLine(match.slice(1).join(''), true);
            cursor = match.index + match[0].length ;
        }
        code += _newLine(str.substr(cursor, str.length - cursor));

        // eliminating superfluous spaces
        code = (code + 'return lines.join("");').replace(/[\r\t\n]/g, '');

        return new Function('feature', 'data', code)(this.features, this.data);
    }
}
// first we change the written \[n|r|t] to remain as written in the
// final output, and then we adapt the ones that are
// properly [new lines|returns|tabs]
const _textLine = line => 'lines.push("'.concat(line
        .replace(/\\n/g, '\\\\n')
        .replace(/\n/g, '\\n')
        .replace(/\\r/g, '\\\\r')
        .replace(/\r/g, '\\r')
        .replace(/\\t/g, '\\\\t')
        .replace(/\t/g, '\\t')
        .replace(/"/g, '\\"'),
    '");\n');

const _jsLine = line => line.trim()
    .replace(/\n/g, '')
    .replace(/[ ]{2,}/g, ' ')
    .concat('\n');

const _isInterpolatedValue = line => line.charAt(0) === '=';

const _interpolatedValue = line => `lines.push(${line.substr(1)});\n`;

const _newLine = (line, isJavascript) => isJavascript ?
    _isInterpolatedValue(line) ?
        _interpolatedValue(line) :
        _jsLine(line) :
    _textLine(line);

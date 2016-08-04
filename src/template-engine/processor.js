import DelimiterAwareEntity from './delimiter-aware-entity.js';

export default class Processor extends DelimiterAwareEntity {
    constructor(features = {}, data = {}, delimiters = {}) {
        super(delimiters);
        this.features = features;
        this.data = data;
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
                code += 'lines.push("\\n");\n';
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
// then we change quotes escaping them, and after that the quotes
// that were initially escaped, currently with 2 escapes
const _textLine = line => 'lines.push("'.concat(line
        .replace(/\\n/g, '\\\\n')               // \n -> \\n
        .replace(/\n/g, '\\n')                  // line feed \n -> \n
        .replace(/\\r/g, '\\\\r')               // \r -> \\r
        .replace(/\r/g, '\\r')                  // carriage return \r -> \r
        .replace(/\\t/g, '\\\\t')               // \t -> \\t
        .replace(/\t/g, '\\t')                  // new tab \t -> \t
        .replace(/"/g, '\\"')                   // " -> \"
        .replace(/\\\\\"/g, '\\\\\\\"'),        // \\" -> \\\"
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

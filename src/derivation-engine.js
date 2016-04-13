import { readFile, writeFile, walkDir } from './file-utils';

export class DerivationEngine {
    constructor() {
        this.delimiters = {};
    }

    generateProject(inputPath, outputPath) {
        walkDir(inputPath, (filePath, isFolder) => {
            if (!isFolder) {
                writeFile(
                    filePath.replace(inputPath, outputPath),
                    readFile(filePath));
            }
        });
    }

    addDelimiter(extensions, start, end) {
        if (Array.isArray(extensions)) {
            extensions.forEach((e) => this::_addSingleDelimiter(e, start, end));
        } else {
            this::_addSingleDelimiter(extensions, start, end);
        }
    }
}

function _addSingleDelimiter(extension, start, end) {
    this.delimiters[extension] = { start, end };
}

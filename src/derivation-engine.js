import { readFile, writeFile, walkDir } from './file-utils';

export class DerivationEngine {
    constructor() {}

    generateProject(inputPath, outputPath) {
        walkDir(inputPath, (filePath, isFolder) => {
            if (!isFolder) {
                console.log(`writing ${filePath} to ${filePath.replace(inputPath, outputPath)}`);
                writeFile(filePath.replace(inputPath, outputPath), readFile(filePath));
            }
        });
    }
}

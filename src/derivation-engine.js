import { readFile, writeFile, walkDir } from './file-utils';
import FeatureModel from './feature-model/feature-model';
import TemplateEngine from './template-engine/template-engine';

const _extension = f => f.substring(f.lastIndexOf('.') + 1);

export default class DerivationEngine {
    constructor() {
        this.featureModel = null;
        this.templateEngine = new TemplateEngine();
        this.features = {};
        this.data = {};
        this.ignore = [];
    }

    generateProject(inputPath, outputPath) {
        const processor = this.templateEngine.createProcessor(this.features, this.data);
        walkDir(inputPath, (filePath, isFolder) => {
            if (!isFolder) {
                writeFile(
                    filePath.replace(inputPath, outputPath),
                    processor.process(readFile(filePath), _extension(filePath)));
            }
        }, this.ignore);
    }

    setFeatureModel(featureModel) {
        if (!featureModel) throw 'feature model must be provided';

        if (typeof featureModel == 'string')
            this.featureModel = FeatureModel.fromXml(featureModel);
        else
            this.featureModel = FeatureModel.fromJson(featureModel);

        this.featureModel.validateFeatureModel();
    }

    setConfig(config) {
        if (Array.isArray(config.delimiters)) {
            if (!this.featureModel) throw 'feature model not defined';

            config.delimiters.forEach(d => {
                d.extension.forEach(e => {
                    this.templateEngine.addDelimiter(e, d.start, d.end);
                });
            });
        }

        if (Array.isArray(config.ignore)) {
            this.ignore = config.ignore;
        }
    }

    setProject(project) {
        // features list switch to feature object like struct
        this.featureModel.completeFeatureSelection(project.features).forEach(f => {
            this.features[f] = true;
        });

        this.data = project.data || {};
    }
}

import { readFile, writeFile, walkDir } from './file-utils';
import FeatureModel from './feature-model/feature-model';
import TemplateEngine from './template-engine/template-engine';
import AnalysisReport from './template-engine/analysis-report';
import path from 'path';

const _extension = f => f.substring(f.lastIndexOf('.') + 1);

export default class DerivationEngine {
    constructor(codePath, featureModel, config) {
        this.featureModel = null;
        this.ignore = [];
        this.templateEngine = new TemplateEngine();

        if (!codePath) {
            throw 'Code path is required to create a Derivation Engine';
        }
        this.codePath = codePath;

        if (featureModel) {
            this.setFeatureModel(featureModel);
        }

        if (config) {
            this.setConfig(config);
        }
    }

    generateProduct(outputPath, product = {}) {
        const features = {};
        const data = product.data || {};

        if (product.features) {
            this.featureModel
                .completeFeatureSelection(product.features)
                .forEach(f => {
                    features[f] = true;
                }
            );
        }

        const processor = this.templateEngine.createProcessor(features, data);

        walkDir(this.codePath, (filePath, isFolder) => {
            if (!isFolder) {
                writeFile(
                    filePath.replace(this.codePath, outputPath),
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

    analyseAnnotations() {
        const report = new AnalysisReport();
        const analyser = this.templateEngine.createAnalyser();

        walkDir(this.codePath, (filePath, isFolder) => {
            if (!isFolder) {
                report.addAnalysis(
                    filePath.replace(`${this.codePath}${path.sep}`, ''),
                    analyser.analyse(readFile(filePath), _extension(filePath))
                );
            }
        }, this.ignore);

        return report;
    }
}

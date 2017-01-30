import { readFile, writeFile, walkDir } from './file-utils';
import FeatureModel from './feature-model/feature-model';
import TemplateEngine from './template-engine/template-engine';
import AnalysisReport from './template-engine/analysis-report';
import path from 'path';
import isTextOrBinary from 'istextorbinary';

const _extension = f => f.substring(f.lastIndexOf('.') + 1);
const _fileName = f => path.basename(f);
const _dir = f => path.dirname(f);

export default class DerivationEngine {
    constructor(codePath, featureModel, config, extraJS) {
        this.featureModel = null;
        this.ignore = [];
        this.templateEngine = new TemplateEngine({}, extraJS);

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

        if (extraJS) {
            this.extraJS = extraJS;
        }
    }

    setFeatureModel(featureModel) {
        if (!featureModel) throw 'feature model must be provided';

        if (typeof featureModel == 'object') {
            this.featureModel = FeatureModel.fromJson(featureModel);
        } else {
            try {
                this.featureModel = FeatureModel.fromJson(JSON.parse(featureModel));
            } catch (e) {
                this.featureModel = FeatureModel.fromXml(featureModel);
            }
        }

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

    generateProduct(outputPath, product = {}) {
        const features = {};
        const data = product.data || {};
        let fileContent;

        if (product.features) {
            this.featureModel
                .completeFeatureSelection(product.features)
                .forEach(f => {
                    features[f] = true;
                }
            );
        }

        const fileGenerator = this.templateEngine.createFileGenerator(features, data);
        const processor = this.templateEngine.createProcessor(features, data);

        walkDir(this.codePath, (fPath, isFolder) => {
            if (isFolder) return;

            if (!this.fileIsText(fPath)) {
                writeFile(
                    fPath.replace(this.codePath, outputPath),
                    readFile(fPath, true)
                );
                return;
            }

            fileContent = readFile(fPath);
            fileGenerator
                .filesToCreate(fileContent, _extension(fPath), _fileName(fPath), outputPath, {})
                .forEach(r => {
                    writeFile(
                        _dir(fPath.replace(this.codePath, outputPath)) + '/' + r.fileName,
                        processor.process(r.fileContent, _extension(fPath), r.context));
                });
        }, this.ignore);
    }

    analyseAnnotations() {
        const report = new AnalysisReport(this.featureModel);
        const analyser = this.templateEngine.createAnalyser();

        walkDir(this.codePath, (fPath, isFolder) => {
            if (!isFolder) {
                if (this.fileIsText(fPath)) {
                    report.addAnalysis(
                        fPath.replace(`${this.codePath}${path.sep}`, ''),
                        analyser.analyse(readFile(fPath), _extension(fPath))
                    );
                }
            }
        }, this.ignore);

        return report;
    }

    fileIsText(fPath) {
        return this.templateEngine.delimiterFor(_extension(fPath)) || isTextOrBinary.isTextSync(fPath);
    }
}

import {readFile, writeFile, walkDir} from './file-utils';
import FeatureModel from './feature-model/feature-model';
import TemplateEngine from './template-engine/template-engine';
import AnalysisReport from './template-engine/analysis-report';
import path from 'path';
import isTextOrBinary from 'istextorbinary';
import JSZip from 'jszip';

const _extension = f => f.substring(f.lastIndexOf('.') + 1);
const _fileName = f => path.basename(f);
const _dir = f => path.dirname(f);

export default class DerivationEngine {
  constructor(codePath, featureModel, config, extraJS, modelTransformation, verbose) {
    this.featureModel = null;
    this.ignore = [];
    this.templateEngine = new TemplateEngine({}, extraJS);
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

    if (modelTransformation) {
      this.setModelTransformation(modelTransformation);
    }

    this.verbose = verbose;
  }

  generateZip(product = {}) {
    if (this.modelTransformation) {
      product = this.modelTransformation(product);
    }
    const features = {};
    const data = product.data || {};

    if (product.features) {
      this.featureModel
        .completeFeatureSelection(product.features)
        .forEach(f => {
          features[f] = true;
        });
    }

    const fileGenerator = this.templateEngine.createFileGenerator(features, data);
    const processor = this.templateEngine.createProcessor(features, data);

    const output = new JSZip();
    const promises = [];

    // only taking files in 'code/'
    const codePath = 'code/';
    const filePaths = Object.keys(this.zip.files).filter(fPath => fPath.startsWith(codePath));

    filePaths.forEach(fPath => {
      promises.push( // storing all promises to wait for then later
        this.zip.files[fPath].async(this.fileIsText(fPath) ? 'string' : 'blob').then(fileContent => {
          if (fileContent == '') return ; // avoiding folders

          if (!this.fileIsText(fPath)) { // binary files
            // FIXME: the filter of binary files is not working properly with files without extension
            return output.file(fPath.substr(5), fileContent);
          }

          fileGenerator
            .filesToCreate(fileContent, _extension(fPath), _fileName(fPath), '', {})
            .forEach(r => {
              const generatedContent = processor.process(r.fileContent, _extension(fPath), r.context);
              const generatedFilePath = (_dir(fPath.replace(codePath, '')) + '/' + r.fileName).replace('./', '');
              if (generatedContent && (typeof(generatedContent) != 'string' || generatedContent.trim())) {
                return output.file(generatedFilePath, generatedContent);
              }
            });
        })
      );
    });

    return Promise.all(promises).then(() => output);
  }

  generateProduct(outputPath, product = {}) {
    if (this.modelTransformation) {
      product = this.modelTransformation(product);
    }
    const features = {};
    const data = product.data || {};
    let fileContent;

    if (product.features) {
      this.featureModel
        .completeFeatureSelection(product.features)
        .forEach(f => {
          features[f] = true;
        });
    }

    const fileGenerator = this.templateEngine.createFileGenerator(features, data);
    const processor = this.templateEngine.createProcessor(features, data);

    walkDir(this.codePath, (fPath, isFolder) => {
      if (isFolder) return;

      if (!this.fileIsText(fPath)) {
        writeFile(
          fPath.replace(this.codePath, outputPath),
          readFile(fPath, true),
          true
        );
        return;
      }

      fileContent = readFile(fPath);
      fileGenerator
        .filesToCreate(fileContent, _extension(fPath), _fileName(fPath), outputPath, {})
        .forEach(r => {
          if (this.verbose) {
            console.log('');
            console.log('Input file.....: ' + fPath);
            console.log('File name..: ' + r.fileName);
            console.log('Output file: ' + _dir(fPath.replace(this.codePath, outputPath)) + '/' + r.fileName);
          }

          writeFile(
            _dir(fPath.replace(this.codePath, outputPath)) + '/' + r.fileName,
            processor.process(r.fileContent, _extension(fPath), r.context));
        });
    }, this.ignore);
  }

  loadZip(zipFile) {
    var promises = [];
    this.zip = zipFile;
    promises.push(this.zip.files['extra.js'].async('string').then(extrajs => {
      this.templateEngine = new TemplateEngine({}, extrajs);
    }));
    promises.push(this.zip.files['config.json'].async('string').then(config => {
      this.setConfig(JSON.parse(config));
    }));
    promises.push(this.zip.files['model.xml'].async('string').then(model => {
      this.setFeatureModel(model);
    }));
    const modelTransformationFile = this.zip.files['transformation.js'];
    if (modelTransformationFile) {
      promises.push(modelTransformationFile.async('string').then(mt => {
        this.setModelTransformation(eval(mt));
      }));
    }
    return Promise.all(promises);
  }

  setModelTransformation(mt) {
    this.modelTransformation = mt;
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

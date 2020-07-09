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
    if (typeof codePath === 'object' && codePath.zip) {
      return this.loadZip(codePath.zip, codePath).then(() => this);
    } else {
      if (typeof codePath === 'object') {
        ({
          codePath,
          featureModel,
          config,
          extraJS,
          modelTransformation,
          verbose
        } = codePath);
      }
      return this.loadLocal(codePath, featureModel, config, extraJS, modelTransformation, verbose);
    }
  }

  /**
   *
   * @param String codePath - path to the annotated code
   * @param JSON|XML featureModel - feature model in json or xml text
   * @param Object config - json with config options
   * @param JS extraJS - javascript text that work as helper functions during the derivation
   * @param JSFunction modelTransformation - javascript text with a function that transforms the product
   * @param boolean verbose - global verbose flag (boolean)
   */
  loadLocal(codePath, featureModel, config, extraJS, modelTransformation, verbose) {
    this.templateEngine = new TemplateEngine({}, extraJS);
    this.codePath = codePath;

    if (featureModel) {
      this.setFeatureModel(featureModel);
    }

    this.ignore = [];
    if (config) {
      this.setConfig(config);
    }

    if (modelTransformation) {
      this.setModelTransformation(modelTransformation);
    }

    this.verbose = verbose;
  }

  /**
   *
   * @param {zip} zipFile
   * @param {
   *          featureModel: path to feature model within the zip file,
   *          config: path to config within the zip file,
   *          extraJS: path to extra.js within the zip file,
   *          verbose: global verbose flag (boolean)
   *        } opts
   */
  loadZip(zipFile, opts = {}) {
    this.zip = zipFile;
    opts.featureModel = opts.featureModel || 'model.xml';
    opts.config = opts.config || 'config.json';
    opts.extraJS = opts.extraJS || 'extra.js';
    opts.modelTransformation = opts.modelTransformation || 'transformation.js'
    this.verbose = opts.verbose;

    const promises = [];
    if (this.zip.files[opts.extraJS]) {
      promises.push(this.zip.files[opts.extraJS].async('string').then(extrajs => {
        this.templateEngine = new TemplateEngine({}, extrajs);
      }));
    } else {
      this.templateEngine = new TemplateEngine({}, '');
    }
    promises.push(this.zip.files[opts.config].async('string').then(config => {
      this.setConfig(JSON.parse(config));
    }));
    promises.push(this.zip.files[opts.featureModel].async('string').then(model => {
      this.setFeatureModel(model);
    }));
    const modelTransformationFile = this.zip.files[opts.modelTransformation];
    if (modelTransformationFile) {
      promises.push(modelTransformationFile.async('string').then(mt => {
        this.setModelTransformation(mt);
      }));
    }

    return Promise.all(promises);
  }

  /**
   *
   * @param JSON product - json spec of the product
   * @param {
   *          type = local | zip,
   *          zipType: String,
   *          verbose: Boolean - local verbose flag,
   *          outputPath: String
   *        } opts
   *
   */
  generate(product = {}, opts = {}) {
    this.verbose = opts.verbose;
    opts.type = opts.type || 'zip';
    opts.zipType = opts.zipType || 'blob';

    if (this.modelTransformation) {
      product = this.modelTransformation(product);
    }
    const features = this._prepareFeatures(product.features);
    const data = product.data || {};
    const fileGenerator = this.templateEngine.createFileGenerator(features, data);
    const processor = this.templateEngine.createProcessor(features, data);

    if (opts.type == 'zip') {
      const output = new JSZip();
      const promises = [];

      // only taking files in 'code/'
      const codePath = 'code/';
      const filePaths = Object.keys(this.zip.files).filter(fPath => fPath.startsWith(codePath));

      filePaths.forEach(fPath => {
        promises.push( // storing all promises to wait for then later
          this.zip.files[fPath].async(this.fileIsText(fPath) ? 'string' : opts.zipType).then(fileContent => {
            if (fileContent == '') return ; // avoiding folders

            if (!this.fileIsText(fPath)) { // binary files
              // FIXME: the filter of binary files is not working properly with files without extension
              return output.file(fPath.substr(5), fileContent);
            }

            fileGenerator
              .filesToCreate(fileContent, _extension(fPath), _fileName(fPath), '', {})
              .forEach(r => {
                if (this.verbose) {
                  console.log('');
                  console.log('Input file.....: ' + fPath);
                  console.log('File name..: ' + r.fileName);
                  console.log('Output file: ' + _dir(fPath.replace(this.codePath, '')) + '/' + r.fileName);
                }
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
    } else {
      let fileContent;
      walkDir(this.codePath, (fPath, isFolder) => {
        if (isFolder) return;

        if (!this.fileIsText(fPath)) {
          writeFile(
            fPath.replace(this.codePath, opts.outputPath),
            readFile(fPath, true),
            true
          );
          return;
        }

        fileContent = readFile(fPath);
        fileGenerator
          .filesToCreate(fileContent, _extension(fPath), _fileName(fPath), opts.outputPath, {})
          .forEach(r => {
            if (this.verbose) {
              console.log('');
              console.log('Input file.....: ' + fPath);
              console.log('File name..: ' + r.fileName);
              console.log('Output file: ' + _dir(fPath.replace(this.codePath, opts.outputPath)) + '/' + r.fileName);
            }

            writeFile(
              _dir(fPath.replace(this.codePath, opts.outputPath)) + '/' + r.fileName,
              processor.process(r.fileContent, _extension(fPath), r.context));
          });
      }, this.ignore);

      return Promise.all([]);
    }
  }

  _prepareFeatures(productFeatures) {
    if (!productFeatures) return {};
    const features = {};
    this.featureModel
      .completeFeatureSelection(productFeatures)
      .forEach((f) => {
        features[f] = true;
      });
    return features;
  }

  generateZip(product = {}, opts = {}) {
    return this.generate(product, { type: 'zip', zipType: opts.type, verbose: opts.verbose });
  }

  generateProduct(outputPath, product = {}) {
    return this.generate(product, { type: 'local', outputPath: outputPath });
  }

  setModelTransformation(mt) {
    this.modelTransformation = eval(mt);
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

  _analyseAnnotationsZip(opts) {
    const zipType = opts.type || 'blob';

    const report = new AnalysisReport(this.featureModel);
    const analyser = this.templateEngine.createAnalyser();

    const promises = [];

    // only taking files in 'code/'
    const codePath = 'code/';
    const filePaths = Object.keys(this.zip.files).filter(fPath => fPath.startsWith(codePath));

    filePaths.forEach(fPath => {
      promises.push( // storing all promises to wait for then later
        this.zip.files[fPath].async(this.fileIsText(fPath) ? 'string' : zipType).then(fileContent => {
          if (fileContent == '') return; // avoiding folders

          if (!this.fileIsText(fPath)) return; // avoiding binary files

          report.addAnalysis(
            fPath,
            analyser.analyse(fileContent, _extension(fPath))
          );

          return;
        })
      );
    });

    return Promise.all(promises).then(() => report);
  }

  _analyseAnnotationsPath() {
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

  analyseAnnotations(opts) {
    if (this.zip) {
      return this._analyseAnnotationsZip(opts);
    } else {
      return this._analyseAnnotationsPath();
    }
  }

  fileIsText(fPath) {
    return this.templateEngine.delimiterFor(_extension(fPath)) || isTextOrBinary.isTextSync(fPath);
  }
}

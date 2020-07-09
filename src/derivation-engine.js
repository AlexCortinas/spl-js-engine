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


class Output {
  constructor() {}

  // eslint-disable-next-line no-unused-vars
  add(fPath, fContent, bin) {}
}

class ZipOutput extends Output {
  constructor() {
    super();
  }

  add(fPath, fContent) {
    this.zip.file(fPath, fContent);
  }
}

class LocalOutput extends Output {
  constructor(outputPath) {
    super();
    this.outputPath = outputPath;
  }

  add(fPath, fContent, bin = false) {
    writeFile(this.outputPath + path.sep + fPath, fContent, bin);
  }
}

class Input {
  constructor() {
    this.handledExtensions = [];
  }

  addHandledExtension(extension) {
    this.handledExtensions.push(extension);
  }

  fileIsText(fPath) {
    return this.handledExtensions.indexOf(fPath) != -1 || isTextOrBinary.isTextSync(fPath);
  }

  // eslint-disable-next-line no-unused-vars
  exists(path) {}
  // eslint-disable-next-line no-unused-vars
  get(path) {}
  setIgnorePattern(){}
  // eslint-disable-next-line no-unused-vars
  forEachCodeFile(cb) {}
}

class ZipInput extends Input {
  constructor(zipFile, codePath) {
    super();
    this.zip = zipFile;
    this.codePath = codePath;
  }

  exists(path) {
    return this.zip.files[path] != null;
  }

  get(path) {
    return this.zip.files[path].async('string');
  }

  forEachCodeFile(cb) {
    const filePaths = Object.keys(this.zip.files).filter(fPath => fPath.startsWith(this.codePath));
    const promises = [];

    filePaths.forEach(fPath => {
      const isText = this.fileIsText(fPath);

      promises.push(this.zip.files[fPath].async(isText ? 'string' : 'blob').then(fContent => {
        return cb(fPath.replace(this.codePath, ''), fContent, isText);
      }));
    });

    return Promise.all(promises);
  }
}

class LocalInput extends Input {
  constructor(codePath) {
    super();
    this.codePath = codePath;
    this.ignore = [];
  }

  setIgnorePattern(ignoreArray) {
    this.ignore = ignoreArray;
  }

  forEachCodeFile(cb) {
    walkDir(this.codePath, (fPath, isFolder) => {
      if (isFolder) return;
      const isText = this.fileIsText(fPath);

      return cb(fPath.replace(this.codePath, ''), readFile(fPath, !isText), isText);
    }, this.ignore);
    return Promise.all([]);
  }
}

export default class DerivationEngine {
  constructor(codePath, featureModel, config, extraJS, modelTransformation, verbose) {
    const promises = [];

    if (typeof codePath === 'object' && codePath.zip) {
      // codePath is in fact an object with all the params
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
      this.input = new ZipInput(codePath.zip, codePath.codePath || 'code');
      if (this.input.exists(codePath.extraJS || 'extra.js')) {
        promises.push(this.input.get(codePath.extraJS || 'extra.js').then(content => extraJS = content));
      }
      promises.push(this.input.get(codePath.featureModel || 'model.xml').then(content => featureModel = content));
      promises.push(this.input.get(codePath.config || 'config.json').then(content => config = JSON.parse(content)));
      if (this.input.exists(codePath.modelTransformation || 'transformation.js')) {
        promises.push(this.input.get(codePath.modelTransformation || 'transformation.js')
          .then(content => modelTransformation = content));
      }
      verbose = codePath.verbose;

    } else {
      /**
       *
       * @param String codePath - path to the annotated code
       * @param JSON|XML featureModel - feature model in json or xml text
       * @param Object config - json with config options
       * @param JS extraJS - javascript text that work as helper functions during the derivation
       * @param JSFunction modelTransformation - javascript text with a function that transforms the product
       * @param boolean verbose - global verbose flag (boolean)
       */
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
      this.input = new LocalInput(codePath);
    }

    return Promise.all(promises).then(() => {
      this.templateEngine = new TemplateEngine({}, extraJS);

      if (featureModel) {
        this.setFeatureModel(featureModel);
      }

      if (config) {
        this.setConfig(config);
      }

      if (modelTransformation) {
        this.setModelTransformation(modelTransformation);
      }

      this.verbose = verbose;
    }).then(() => {
      return this;
    });
  }

  generateZip(product = {}, opts = {}) {
    return this.generate(product, { type: 'zip', zipType: opts.type, verbose: opts.verbose });
  }

  generateProduct(outputPath, product = {}) {
    return this.generate(product, { type: 'local', outputPath: outputPath });
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
      this.output = new ZipOutput();
    } else {
      this.output = new LocalOutput(opts.outputPath);
    }

    return this.input.forEachCodeFile((fPath, fContent, isText) => {
      if (!isText) {
        return this.output.add(fPath, fContent, true);
      }

      fileGenerator
        .filesToCreate(fContent, _extension(fPath), _fileName(fPath), '', {})
        .forEach(r => {
          if (this.verbose) {
            console.log('');
            console.log('Input file.....: ' + fPath);
            console.log('File name..: ' + r.fileName);
            console.log('Output file: ' + _dir(fPath) + '/' + r.fileName);
          }
          const generatedContent = processor.process(r.fileContent, _extension(fPath), r.context);
          const generatedFilePath = (_dir(fPath) + '/' + r.fileName).replace('./', '');
          if (generatedContent && (typeof(generatedContent) != 'string' || generatedContent.trim())) {
            return this.output.add(generatedFilePath, generatedContent);
          }
        });
    }).then(() => this.output.get());
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
          this.input.addHandledExtension(e);
          this.templateEngine.addDelimiter(e, d.start, d.end);
        });
      });
    }

    if (Array.isArray(config.ignore)) {
      this.input.setIgnorePattern(config.ignore);
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

import Processor from "./processor.js";
import Delimiter from "./delimiter.js";
import Analyser from "./analyser.js";
import FileGenerator from "./file-generator.js";

export default class TemplateEngine {
  constructor({ startDelimiter, endDelimiter } = {}, extraJS = "") {
    this.delimiters = {};
    if (startDelimiter && endDelimiter) {
      this.addDelimiter("default", startDelimiter, endDelimiter);
    }
    this.extraJS = extraJS;
  }

  createProcessor(features, data) {
    return new Processor(features, data, this.delimiters, this.extraJS);
  }

  createFileGenerator(features, data) {
    return new FileGenerator(features, data, this.delimiters, this.extraJS);
  }

  createAnalyser() {
    return new Analyser(this.delimiters);
  }

  addDelimiter(type, start, end) {
    this.delimiters[type] = new Delimiter(start, end);
  }

  delimiterFor(extension) {
    return this.delimiters[extension];
  }
}

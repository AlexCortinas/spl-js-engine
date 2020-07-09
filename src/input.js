import isTextOrBinary from 'istextorbinary';
import {readFile, walkDir} from './file-utils';
import {getExtension} from './file-utils';

class Input {
  constructor() {
    this.handledExtensions = [];
  }

  addHandledExtension(extension) {
    this.handledExtensions.push(extension);
  }

  fileIsText(fPath) {
    return this.handledExtensions.indexOf(getExtension(fPath)) != -1 || isTextOrBinary.isTextSync(fPath);
  }

  // eslint-disable-next-line no-unused-vars
  exists(path) {}
  // eslint-disable-next-line no-unused-vars
  get(path) {}
  setIgnorePattern(){}
  // eslint-disable-next-line no-unused-vars
  forEachCodeFile(cb) {}
}

export class ZipInput extends Input {
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

export class LocalInput extends Input {
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

import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

export function existsFile(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (e) {
    return false;
  }
}

export function readFile(filePath, bin = false) {
  return fs.readFileSync(filePath, bin ? null : 'utf8');
}

export function writeFile(filePath, data, bin = false) {
  if (!bin && !data) return;
  mkDirRecursively(path.dirname(filePath));
  fs.writeFileSync(filePath, data, bin ? null : 'utf8');
}

function mkDirRecursively(folderPath) {
  const parentPath = path.dirname(folderPath);

  if (!existsFile(parentPath)) {
    mkDirRecursively(parentPath);
  }

  const stat = existsFile(folderPath);

  if (!stat) {
    fs.mkdirSync(folderPath);
  } else if (stat.isFile()) {
    throw `Found file on ${folderPath} while creating a folder`;
  }
}

export function walkDir(pathToWalk, cb, ignore = []) {
  let stat = existsFile(pathToWalk);

  if (!stat || stat.isFile()) return;

  fs.readdirSync(pathToWalk).filter(function (path) {
    return ignore.indexOf(path) == -1;
  }).forEach((filePath) => {
    const fullFilePath = `${pathToWalk}${path.sep}${filePath}`;
    stat = fs.statSync(fullFilePath);

    if (stat.isFile()) {
      cb(fullFilePath, false);
    } else if (stat.isDirectory()) {
      walkDir(fullFilePath, cb);
    }
  });

  cb(pathToWalk, true);
}

export function readJsonFromFile(path) {
  const stat = existsFile(path);

  if (!stat || !stat.isFile()) {
    throw `${path} is not a file`;
  }

  const fileContent = readFile(path);

  try {
    return JSON.parse(fileContent);
  } catch (e) {
    // nothing to do
  }

  try {
    return YAML.parse(fileContent);
  } catch (e) {
    // nothing to do
  }

  return undefined;
}

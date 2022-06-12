import { dirname, join, parse, normalize, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { stat } from 'fs/promises';
import { errorMsg } from '../errors/msg.js';

// url should be import.meta.url
const getDirName = (url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  return __dirname;
};

const checkPath = async (path) => {
  try {
    await stat(path);
    return true;
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

export { getDirName, join, dirname, parse, normalize, isAbsolute, checkPath };

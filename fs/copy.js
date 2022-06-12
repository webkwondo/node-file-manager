import { promisify } from 'util';
import { stat } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { dirname } from '../nwd/path.js';
import { errorMsg } from '../errors/msg.js';

const pipelinePromise = promisify(pipeline);

export const copyFile = async (sourcePath, destPath) => {
  let destFileExists = false;

  try {
    await stat(destPath);
    destFileExists = true;
    throw new Error(errorMsg.fail);
  } catch (error) {
    if (!destFileExists) {
      try {
        const destDir = dirname(destPath);
        await stat(destDir);
        await stat(sourcePath);
        const readable = createReadStream(sourcePath);
        const writable = createWriteStream(destPath);
        await pipelinePromise(readable, writable);
      } catch (e) {
        throw new Error(errorMsg.fail);
      }
    } else {
      throw new Error(errorMsg.fail);
    }
  }
};

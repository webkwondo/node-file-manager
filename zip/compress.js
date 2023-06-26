import { createBrotliCompress } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { stat, unlink } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { errorMsg } from '../errors/msg.js';

const pipelinePromise = promisify(pipeline);

export const compress = async (sourcePath, destPath) => {
  const doZip = async (input, output) => {
    const brotli = createBrotliCompress();
    const source = createReadStream(input);
    const destination = createWriteStream(output);
    await pipelinePromise(source, brotli, destination);
  };

  try {
    await stat(sourcePath);
    await doZip(sourcePath, destPath);
    // await unlink(sourcePath);
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

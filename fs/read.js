import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { stdout } from 'process';
import { EOL } from 'os';
import { errorMsg } from '../errors/msg.js';

export const readFile = async (filePath) => {
  try {
    await stat(filePath);

    const readable = createReadStream(filePath);

    readable.pipe(stdout);

    readable.on('end', () => {
      console.log(EOL);
    });
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

import { createHash } from 'crypto';
import { open } from 'fs/promises';
import { stdout } from 'process';
import { EOL } from 'os';
import { errorMsg } from '../errors/msg.js';

export const calculateHash = async (filePath) => {
  try {
    const file = await open(filePath);
    const readableStream = file.createReadStream();
    const hash = createHash('sha256');

    await readableStream.pipe(hash).setEncoding('hex').pipe(stdout);

    readableStream.on('end', () => {
      console.log(EOL);
    });
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

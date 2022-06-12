import { writeFile } from 'fs/promises';
import { errorMsg } from '../errors/msg.js';

export const createFile = async (filePath, data = '') => {
  try {
    await writeFile(filePath, data, { flag: 'wx' });
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

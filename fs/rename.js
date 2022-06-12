import { rename, stat } from 'fs/promises';
import { errorMsg } from '../errors/msg.js';

export const renameFile = async (sourceFilePath, destFilePath) => {
  let destFileExists = false;

  try {
    await stat(destFilePath);
    destFileExists = true;
    throw new Error(errorMsg.fail);
  } catch (error) {
    if (!destFileExists) {
      try {
        await rename(sourceFilePath, destFilePath);
      } catch (e) {
        throw new Error(errorMsg.fail);
      }
    } else {
      throw new Error(errorMsg.fail);
    }
  }
};

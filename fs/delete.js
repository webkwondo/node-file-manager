import { unlink } from 'fs/promises';
import { errorMsg } from '../errors/msg.js';

export const deleteFile = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (error) {
    throw new Error(errorMsg.fail);
  }
};

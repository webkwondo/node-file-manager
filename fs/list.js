import { readdir } from 'fs/promises';
import { getDirName, join } from '../nwd/path.js';
import { errorMsg } from '../errors/msg.js';

export const list = async (dirPath) => {
  let direntsArr = [];

  try {
    direntsArr = await readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    throw new Error(errorMsg.fail);
  }

  const paths = direntsArr.map((dirent) => {
    return dirent.name;
  }).filter((i) => i);

  console.log(paths);
};

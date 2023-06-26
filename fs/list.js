import { readdir } from 'fs/promises';
import { errorMsg } from '../errors/msg.js';

export const list = async (dirPath) => {
  let direntsArr = [];

  try {
    direntsArr = await readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    throw new Error(errorMsg.fail);
  }

  const directories = [];
  const files = [];

  direntsArr.forEach((dirent) => {
    const type = dirent.isDirectory() ? 'directory' : 'file';
    const row = { Name: dirent.name, Type: type };

    if (dirent.isDirectory()) {
      directories.push(row);
    } else {
      files.push(row);
    }
  });

  directories.sort((a, b) => a.Name.localeCompare(b.Name));
  files.sort((a, b) => a.Name.localeCompare(b.Name));

  const dataTable = [...directories, ...files];

  console.table(dataTable);
};

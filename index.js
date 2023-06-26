import readline from 'readline';
import { homedir, EOL, getOsInfo } from './os/os.js';
import { stdin, stdout, exit } from 'process';
import { dirname, join, resolve, parse, checkPath, isAbsolute } from './nwd/path.js';
import { errorMsg } from './errors/msg.js';
import { parseArg, getCommandArg } from './args/parse.js';
import { list } from './fs/list.js';
import { createFile } from './fs/create.js';
import { renameFile } from './fs/rename.js';
import { deleteFile } from './fs/delete.js';
import { copyFile } from './fs/copy.js';
import { readFile } from './fs/read.js';
import { calculateHash } from './hash/calc.js';
import { compress } from './zip/compress.js';
import { decompress } from './zip/decompress.js';

const usernameArgName = '--username=';
let username = parseArg(usernameArgName);
let pwd = homedir();
const greetMsg = 'Welcome to the File Manager';
const goodbyeMsg = 'Thank you for using File Manager';
const pwdMsg = 'You are currently in';

const getMsg = (type = 'pwd', str = pwd) => {
  let outMsg = '';

  switch (type) {
    case 'pwd':
      outMsg = `${pwdMsg} ${str}`;
      break;
    case 'greet':
      outMsg = (str) ? `${greetMsg}, ${str}!`:
                       `${greetMsg}!`;
      break;
    case 'goodbye':
      outMsg = (str) ? `${goodbyeMsg}, ${str}, goodbye!` :
                       `${goodbyeMsg}, goodbye!`;
      break;
    default:
      outMsg = '';
      break;
  }

  return outMsg;
};

const displayPwd = () => {
  console.log(getMsg('pwd') + EOL);
};

const getAbsolutePath = (pathStr) => {
  let path = isAbsolute(pathStr) ? pathStr : resolve(pwd, pathStr);
  return path;
};

const command = async (func) => {
  try {
    if (func) {
      await func();
    }
  } catch (error) {
    console.log(EOL + error.message);
  }

  displayPwd();
};

const processLineByLine = async () => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  });

  console.log(getMsg('greet', username));
  displayPwd();

  rl.on('line', async (line) => {
    line = line.trim();

    switch (line) {
      case 'up':
        pwd = join(pwd, '..');
        displayPwd();
        break;
      case line.startsWith('cd ') ? line : null: // 'cd path_to_directory'
        const cd = async () => {
          const destPath = getAbsolutePath(getCommandArg(line, 2, 1));
          await checkPath(destPath);
          pwd = destPath;
        };

        command(cd);
        break;
      case 'ls':
        const ls = async () => {
          await list(pwd);
        };

        command(ls);
        break;
      case line.startsWith('cat ') ? line : null: // 'cat path_to_file'
        const cat = async () => {
          const filePath = getAbsolutePath(getCommandArg(line, 2, 1));
          await readFile(filePath);
        };

        command(cat);
        break;
      case line.startsWith('add ') ? line : null: // add new_file_name
        const add = async () => {
          const fileName = getCommandArg(line, 2, 1);
          const destPath = getAbsolutePath(fileName);
          await createFile(destPath);
        };

        command(add);
        break;
      case line.startsWith('rn ') ? line : null: // 'rn path_to_file new_filename'
        const rn = async () => {
          const sourceFilePath = getAbsolutePath(getCommandArg(line, 3, 1));
          const newFileName = getCommandArg(line, 3, 2);
          const destDirPath = dirname(sourceFilePath);
          const destFilePath = join(getAbsolutePath(destDirPath), newFileName);
          await renameFile(sourceFilePath, destFilePath);
        };

        command(rn);
        break;
      case line.startsWith('cp ') ? line : null: // cp path_to_file path_to_new_directory
        const cp = async () => {
          const sourceFilePath = getAbsolutePath(getCommandArg(line, 3, 1));
          const base = parse(sourceFilePath).base;
          const destDirPath = getCommandArg(line, 3, 2);
          const destFilePath = join(getAbsolutePath(destDirPath), base);
          await copyFile(sourceFilePath, destFilePath);
        };

        command(cp);
        break;
      case line.startsWith('mv ') ? line : null: // mv path_to_file path_to_new_directory
        const mv = async () => {
          const sourceFilePath = getAbsolutePath(getCommandArg(line, 3, 1));
          const base = parse(sourceFilePath).base;
          const destDirPath = getCommandArg(line, 3, 2);
          const destFilePath = join(getAbsolutePath(destDirPath), base);
          await copyFile(sourceFilePath, destFilePath);
          await deleteFile(sourceFilePath);
        };

        command(mv);
        break;
      case line.startsWith('rm ') ? line : null: // rm path_to_file
        const rm = async () => {
          const filePath = getAbsolutePath(getCommandArg(line, 2, 1));
          await deleteFile(filePath);
        };

        command(rm);
        break;
      case line.startsWith('os ') ? line : null:
        const os = async () => {
          const info = getOsInfo(getCommandArg(line, 2, 1));
          console.log(info);
        };

        command(os);
        break;
      case line.startsWith('hash ') ? line : null: // hash path_to_file
        const hash = async () => {
          const filePath = getAbsolutePath(getCommandArg(line, 2, 1));
          await calculateHash(filePath);
        };

        command(hash);
        break;
      case line.startsWith('compress ') ? line : null: // compress path_to_file path_to_destination
        const cmp = async () => {
          const sourcePath = getAbsolutePath(getCommandArg(line, 3, 1));
          const destPath = getAbsolutePath(getCommandArg(line, 3, 2));
          await compress(sourcePath, destPath);
        };

        command(cmp);
        break;
      case line.startsWith('decompress ') ? line : null: // decompress path_to_file path_to_destination
        const decmp = async () => {
          const sourcePath = getAbsolutePath(getCommandArg(line, 3, 1));
          const destPath = getAbsolutePath(getCommandArg(line, 3, 2));
          await decompress(sourcePath, destPath);
        };

        command(decmp);
        break;
      case '':
        console.log(EOL);
        displayPwd();
        break;
      case '.exit':
        rl.close();
        break;
      default:
        console.log(EOL + errorMsg.invalid);
        displayPwd();
        break;
    }

  });

  rl.on('close', () => {
    console.log(getMsg('goodbye', username));
    exit();
  });

  rl.on('error', (error) => {
    console.log(EOL + error.message);
    displayPwd();
  });
};

processLineByLine();

import { errorMsg } from '../errors/msg.js';

const parseArg = (argName) => {
  const args = process.argv.slice(2);

  const usernameArg = args.find((element) => {
    return element.startsWith(argName);
  });

  return (usernameArg) ? usernameArg.slice((argName).length) : '';
};

const getCommandArg = (str, argsNum, index) => {
  try {
    const strArr = str.split(' ');

    if (strArr.length !== argsNum) {
      throw new Error(errorMsg.invalid);
    }

    return (index) ? strArr[index] : strArr[1];
  } catch(error) {
    throw new Error(errorMsg.invalid);
  }
};

export { parseArg, getCommandArg };

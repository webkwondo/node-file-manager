import { errorMsg } from '../errors/msg.js';

const parseArg = (argName) => {
  const args = process.argv.slice(2);

  const usernameArg = args.find((element) => {
    return element.startsWith(argName);
  });

  return (usernameArg) ? usernameArg.slice((argName).length) : '';
};

const handleQuotes = (tokens) => {
  const args = [];
  let currentArg = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith('"')) {
      currentArg += token.slice(1);

      if (token.endsWith('"')) {
        args.push(currentArg.slice(0, -1));
        currentArg = '';
      }
    } else if (token.endsWith('"')) {
      currentArg += ' ' + token.slice(0, -1);
      args.push(currentArg);
      currentArg = '';
    } else if (currentArg !== '') {
      // Middle part of a quoted argument
      currentArg += ' ' + token;
    } else {
      // Non-quoted argument
      args.push(token);
    }
  }

  return args;
};

const getCommandArg = (str, argsNum, index) => {
  try {
    let strArr = str.split(' ');

    if (str.includes('"')) {
      const doubleQuoteCount = (str.match(/"/g) || []).length;

      if (doubleQuoteCount % 2 !== 0) {
        throw new Error(errorMsg.invalid);
      }

      const args = handleQuotes(strArr.slice(1));

      if (args.length + 1 !== argsNum) {
        throw new Error(errorMsg.invalid);
      }

      return (index) ? args[index - 1] : args[0];
    } else {
      if (strArr.length !== argsNum) {
        throw new Error(errorMsg.invalid);
      }

      return (index) ? strArr[index] : strArr[1];
    }
  } catch(error) {
    throw new Error(errorMsg.invalid);
  }
};

export { parseArg, getCommandArg };

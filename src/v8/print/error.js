const isError = require('iserror');

const parseErrors = require('../parse/errors');
const printFrame = require('./frame');

function printError(error, options) {
  let parsedError;

  if (isError(error)) {
    let { stack, message } = error;
    if (!stack) {
      parsedError = { message, stack };
    } else {
      const errors = parseErrors(stack, options);

      parsedError = errors[0];
    }
  } else {
    parsedError = error;
  }

  const { message = 'Error', stack } = parsedError;

  return '' + message + '\n' + stack.map((frame) => printFrame(frame)).join('\n');
}

module.exports = printError;

const isError = require('iserror');

const parseError = require('../parse/error');
const printError = require('./error');

const { isArray } = Array;

function printErrors(errors, options = {}) {
  let parsedErrors;

  if (isError(errors)) {
    parsedErrors = [];
    for (let cause = errors; cause; cause = cause.cause) {
      parsedErrors.push(parseError(cause, options));
    }
  } else if (isArray(errors)) {
    parsedErrors = errors;
  }

  let first = true;
  let str = '';
  for (let i = 0; i < parsedErrors.length; i++) {
    if (!first) str += '\n';
    const cause = parsedErrors[i];
    if (cause.prefix) str += cause.prefix;
    str += printError(cause, options);
    first = false;
  }

  return str;
}

module.exports = printErrors;

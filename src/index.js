function __printFrames(stack, header) {
  return stack.startsWith(header + '\n') ? stack.slice(header.length + 1) : stack;
}

function printFrames(error) {
  return __printFrames(error.stack, printErrorHeader(error));
}

function printErrorHeader(error) {
  const { name, message } = error;

  let header = '';
  header += name || 'Error';
  if (message) header += `: ${message}`;
  return header;
}

function printErrorHeaders(error) {
  let str = '';
  let first = true;
  for (let cause = error; cause; cause = cause.cause) {
    if (!first) str += '\nCaused by: ';

    str += printErrorHeader(cause);

    first = false;
  }
  return str;
}

function printError(error) {
  const { stack } = error;

  const header = printErrorHeader(error);

  return stack ? `${header}\n${__printFrames(stack, header)}` : header;
}

function printErrors(error) {
  let str = '';
  let first = true;
  for (let cause = error; cause; cause = cause.cause) {
    if (!first) str += '\nCaused by: ';

    str += printError(cause);

    first = false;
  }
  return str;
}

function captureFrames(omitFrames = 1) {
  const frames = printFrames(new Error()).split('\n');

  return frames.slice(omitFrames).join('\n');
}

module.exports = {
  printFrames,
  printErrorHeader,
  printErrorHeaders,
  printError,
  printErrors,
  captureFrames,
};

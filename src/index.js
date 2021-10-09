function printError(error) {
  const { name, message, stack } = error;
  let header = '';
  header += name || 'Error';
  if (message) header += `: ${message}`;

  return stack
    ? header + (stack.startsWith(header + '\n') ? stack.slice(header.length + 1) : stack)
    : header;
}

function printErrors(error) {
  let str = '';
  let first = true;
  for (let cause = error; cause; cause = cause.cause) {
    str += printError(cause);

    if (!first) str += '\nCaused by: ';

    first = false;
  }
  return str;
}

module.exports = { printError, printErrors };

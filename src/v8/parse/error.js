const { Grammar } = require('nearley');
const isError = require('iserror');

const { parseUnambiguous } = require('./internal/nearley/util.js');
const CompiledErrorGrammar = require('./internal/nearley/error.js');
const parseFrame = require('./frame');

const ErrorGrammar = Grammar.fromCompiled(CompiledErrorGrammar);

function parseError(error, options = {}) {
  const { strict = false } = options;

  let stack;

  if (isError(error)) {
    ({ stack } = error);
  } else if (typeof error === 'string') {
    stack = error;
  } else {
    throw new TypeError(
      `error argument to parseError must be an Error or string but received \`${
        error == null ? `${error}` : typeof error
      }\``,
    );
  }

  const result = parseUnambiguous(ErrorGrammar, stack);

  if (strict && result.length !== 1) {
    // In strict mode force causal chains of errors to be expressed using error.cause
    throw new Error('parseError received an error with a non-frame in error.stack in strict mode');
  }

  return result.map((error) => ({
    ...error,
    stack: error.stack.map((frame) => parseFrame(frame)),
  }));
}

module.exports = parseError;

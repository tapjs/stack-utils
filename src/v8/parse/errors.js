const { Grammar } = require('nearley');
const isError = require('iserror');

const { parseUnambiguous } = require('./internal/nearley/util.js');
const CompiledErrorGrammar = require('./internal/nearley/error.js');
const parseError = require('./error.js');
const parseFrame = require('./frame');

const ErrorGrammar = Grammar.fromCompiled(CompiledErrorGrammar);

function parseErrors(error, options = {}) {
  if (isError(error)) {
    const chain = [];

    for (let cause = error; cause; cause = cause.cause) {
      const errorChain = parseError(error, options);
      chain.push(...errorChain);
    }
    return chain;
  } else if (typeof error !== 'string') {
    throw new TypeError(
      `error argument to parseError must be an Error or string but received \`${
        error == null ? `${error}` : typeof error
      }\``,
    );
  }

  return parseUnambiguous(ErrorGrammar, error).map((error) => ({
    ...error,
    stack: error.stack.map((frame) => parseFrame(frame)),
  }));
}

module.exports = parseErrors;

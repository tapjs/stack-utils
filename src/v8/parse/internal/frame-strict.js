const { Grammar } = require('nearley');

const { parseUnambiguous } = require('./nearley/util.js');
const CompliedFrameGrammar = require('./nearley/frame-strict.js');

const FrameGrammar = Grammar.fromCompiled(CompliedFrameGrammar);

function parseFrameStrict(str) {
  return parseUnambiguous(FrameGrammar, str);
}

module.exports = parseFrameStrict;

const { Grammar } = require('nearley');

const { parse } = require('./internal/nearley/util.js');
const CompiledFrameGrammar = require('./internal/nearley/frame.js');
const parseFrameStrict = require('./internal/frame-strict.js');

const FrameGrammar = Grammar.fromCompiled(CompiledFrameGrammar);

const isBalanced = (str) => {
  let parens = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str[i];
    if (chr === '(') {
      parens++;
    } else if (chr === ')') {
      if (parens > 0) {
        parens--;
      } else {
        return false;
      }
    }
  }
  return parens === 0;
};

function parseFrame(str) {
  try {
    return parseFrameStrict(str);
  } catch (e) {
    // The ambiguous grammar is more powerful, and may be able to parse this

    let results;
    try {
      results = parse(FrameGrammar, str);
    } catch (e) {
      return null;
    }

    // The frame grammar is fundamentally ambiguous
    // We must make some decisions about what is most likely to be correct
    let best = null;
    let bestScore = -1;
    for (const result of results) {
      const { eval: eval_, call, site } = result;

      let score = 0;
      // Use powers of two to ensure that scores are unambiguous

      if (eval_) score += 32;
      if (call && call.constructor) score += 16;
      if (call && call.method !== call.function) score += 8;
      if (call && call.function) score += 4;
      if (site && isBalanced(site.file)) score += 2;

      if (score > bestScore) {
        bestScore = score;
        best = result;
      }
    }

    return best;
  }
}

module.exports = parseFrame;

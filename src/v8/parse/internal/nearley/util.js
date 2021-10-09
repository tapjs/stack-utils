const { Parser } = require('nearley');

function stringFrom(iterable) {
  let str = '';
  for (const f of iterable) {
    str += f;
  }
  return str;
}

const get = (d, ...keys) => {
  let d_ = d;
  for (let i = 0; i < keys.length; i++) {
    d_ = d_ && d_[keys[i]];
  }
  return d_ == null ? void 0 : d_;
};

const parse = (grammar, str) => {
  const parser = new Parser(grammar);

  parser.feed(str);

  const { results } = parser;

  if (results.length === 0) {
    throw new Error('nearley parsing unexpectedly failed to produce any results');
  }

  return results;
};

const parseUnambiguous = (grammar, str) => {
  const results = parse(grammar, str);

  if (results.length > 1) {
    throw new Error('nearley parsing unexpectedly produced multiple results');
  }

  return results[0];
};

module.exports = { stringFrom, get, parse, parseUnambiguous };

'use strict';

const path = require('path');

module.exports.join = join;
module.exports.fixtureDir = path.join(__dirname, 'fixtures');

function join(...args) {
  return [].concat(...args, '').join('\n');
}

if (module === require.main) {
  require('tap').pass('this is fine');
}

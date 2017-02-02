var flatten = require('flatten');
var path = require('path');

module.exports.join = join;
module.exports.fixtureDir = path.join(__dirname, 'fixtures');

function join() {
  var args = Array.prototype.slice.call(arguments);
  return flatten(args).join('\n') + '\n';
}

if (module === require.main)
  require('tap').pass('this is fine')

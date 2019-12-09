'use strict';
// some capture edge cases not already covered by other tests

const StackUtils = require('../');
const t = require('tap');

const stack = new StackUtils();

// a capture with no function, not much to it, actually
const base = __filename.slice(process.cwd().length + 1).replace(/\\/g, '/');
t.match(stack.at(), { line: Number, column: Number, file: base });

// a capture from a native site
const arr = [ 0 ];
const captures = arr.map(function xyz () {
  return stack.at(xyz);
});
t.match(captures, [ {
  type: 'Array',
  function: 'map'
} ]);

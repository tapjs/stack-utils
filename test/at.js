// some capture edge cases not already covered by other tests

var StackUtils = require('../')
var t = require('tap')

var stack = new StackUtils()

// a capture with no function, not much to it, actually
var base = __filename.substr(process.cwd().length + 1)
t.match(stack.at(), { line: Number, column: Number, file: base })

// a capture from a native site
var arr = [ 0 ]
var captures = arr.map(function xyz (n) {
  return stack.at(xyz)
})
t.match(captures, [ {
  type: 'Array',
  function: 'map'
} ])

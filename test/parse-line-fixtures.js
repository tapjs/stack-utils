var t = require('tap')
var cases = require('./fixtures/parse-fixture.json')
var lines = Object.keys(cases)
var StackUtils = require('../')
var stack = new StackUtils()
t.plan(lines.length * 2)
lines.forEach(function (line) {
  var expect = cases[line]
  t.match(stack.parseLine(line), expect, JSON.stringify(line))
  line = line.replace(/^    at /, '')
  t.match(stack.parseLine(line), expect, JSON.stringify(line))
})

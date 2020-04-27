'use strict';

const path = require('path');
const t = require('tap');
const StackUtils = require('../');
const CaptureFixture = require('./fixtures/capture-fixture');
const utils = require('./_utils');

const LinuxStack1 = utils.join(linuxStack1(), internalStack());
const WindowsStack1 = utils.join(windowsStack1(), internalStack());

const version = process.version.slice(1).split('.').map(Number);

t.test('must be called with new', t => {
  t.is(typeof StackUtils, 'function');
  const stackUtils = StackUtils;
  t.throws(() => stackUtils());
  t.end();
});

t.test('clean: truncates cwd', t => {
  const expectedArray = [
    'foo (foo.js:3:8)',
    'bar (foo.js:7:2)',
    'bar (bar.js:4:2)',
    'Object.<anonymous> (bar.js:7:1)',
    'ontimeout (timers.js:365:14)',
    'tryOnTimeout (timers.js:237:5)',
    'Timer.listOnTimeout (timers.js:207:5)',
    '_combinedTickCallback (internal/process/next_tick.js:67:7)',
    'process._tickCallback (internal/process/next_tick.js:98:9)',
    'Module.runMain (module.js:645:11)',
    'Module._compile (module.js:398:26)',
    'Object.Module._extensions..js (module.js:405:10)',
    'Module.load (module.js:344:32)',
    'Function.Module._load (module.js:301:12)',
    'Function.Module.runMain (module.js:430:10)',
    'module.js:430:10',
    'run (bootstrap_node.js:420:7)',
    'startup (bootstrap_node.js:139:9)',
    'bootstrap_node.js:535:3',
    'startup (node.js:141:18)'
  ];
  const expected = utils.join(expectedArray);

  let stack = new StackUtils({cwd: '/user/dev/project', internals: []});
  t.is(stack.clean(LinuxStack1), expected, 'accepts a linux string');
  t.is(stack.clean(LinuxStack1.split('\n')), expected, 'accepts an array');
  t.is(stack.clean(LinuxStack1.split('\n').slice(1)), expected, 'slices off the message line');

  stack = new StackUtils({cwd: 'Z:\\user\\dev\\project', internals: []});
  t.is(stack.clean(WindowsStack1), expected, 'accepts a windows string');

  const expectIndented = utils.join(expectedArray.map(a => '    ' + a));
  t.is(stack.clean(WindowsStack1, 4), expectIndented, 'indentation');

  t.end();
});

t.test('clean: eliminates internals', t => {
  let stack = new StackUtils({cwd: '/user/dev'});
  const expected = utils.join([
    'foo (project/foo.js:3:8)',
    'bar (project/foo.js:7:2)',
    'bar (project/bar.js:4:2)',
    'Object.<anonymous> (project/bar.js:7:1)'
  ]);
  t.is(stack.clean(LinuxStack1), expected);

  stack = new StackUtils({cwd: 'Z:\\user\\dev'});
  t.is(stack.clean(WindowsStack1), expected);
  t.end();
});

t.test('clean: returns null if it is all internals', t => {
  const stack = new StackUtils();
  t.is(stack.clean(utils.join(internalStack())), '');
  t.end();
});

t.test('captureString: two redirects', t => {
  const stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stack);

  const capturedString = capture.redirect1('redirect2', 'call', 'captureString');
  t.is(capturedString, utils.join([
    'CaptureFixture.call (capture-fixture.js:47:28)',
    'CaptureFixture.redirect2 (capture-fixture.js:13:24)',
    'CaptureFixture.redirect1 (capture-fixture.js:9:24)'
  ]));
  t.end();
});

t.test('captureString: with startStack function', t => {
  const stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stack);

  const capturedString = capture.redirect1('redirect2', 'call', 'captureString', capture.call);
  t.is(capturedString, utils.join([
    'CaptureFixture.redirect2 (capture-fixture.js:13:24)',
    'CaptureFixture.redirect1 (capture-fixture.js:9:24)'
  ]));
  t.end();
});

t.test('captureString: with limit', t => {
  const stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stack);

  const capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1);
  t.is(capturedString, utils.join([
    'CaptureFixture.call (capture-fixture.js:47:28)'
  ]));
  t.end();
});

t.test('captureString: with limit and startStack', t => {
  const stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stack);

  const capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1, capture.call);
  t.is(capturedString, utils.join([
    'CaptureFixture.redirect2 (capture-fixture.js:13:24)'
  ]));
  t.end();
});

t.test('capture returns an array of call sites', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);
  const stack = capture.redirect1('call', 'capture').slice(0, 2);
  t.is(stack[0].getFileName(), path.join(utils.fixtureDir, 'capture-fixture.js'));
  t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
  t.is(stack[1].getFunctionName(), 'redirect1');
  t.end();
});

t.test('capture: with limit', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);
  const stack = capture.redirect1('redirect2', 'call', 'capture', 1);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
  t.end();
});

t.test('capture: with stackStart function', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);
  const stack = capture.redirect1('redirect2', 'call', 'capture', capture.call);
  t.true(stack.length > 1);
  t.is(stack[0].getFunctionName(), 'redirect2');
  t.end();
});

t.test('capture: with limit and stackStart function', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);
  const stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'redirect2');
  t.end();
});

t.test('capture: with wrapCallSite function', t => {
  const wrapper = callsite => ({
    getMethodName () {
      return callsite.getMethodName();
    },
    getFunctionName () {
      return 'testOverrideFunctionName';
    }
  });
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir, wrapCallSite: wrapper});
  const capture = new CaptureFixture(stackUtil);
  const stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'testOverrideFunctionName');
  t.is(stack[0].getMethodName(), 'redirect2');
  t.end();
});

t.test('at', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);
  const at = capture.redirect1('call', 'at');

  t.same(at, {
    file: 'capture-fixture.js',
    line: 47,
    column: 28,
    type: 'CaptureFixture',
    function: 'CaptureFixture.call',
    method: 'call'
  });
  t.end();
});

t.test('at: with stackStart', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: __dirname});
  const capture = new CaptureFixture(stackUtil);

  const at = capture.redirect1('call', 'at', capture.call);

  t.same(at, {
    file: 'fixtures/capture-fixture.js',
    line: 9,
    column: 24,
    type: 'CaptureFixture',
    function: 'redirect1'
  });
  t.end();
});

t.test('at: inside a constructor call', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);

  const at = capture.const('call', 'at', capture.call);

  // TODO: File an issue - if this assert fails, the power assert diagram renderer blows up.
  t.same(at, {
    file: 'capture-fixture.js',
    line: 20,
    column: 32,
    constructor: true,
    type: 'Constructor',
    function: 'Constructor'
  });
  t.end();
});

t.test('at: method on an [Object] instance', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);

  const at = capture.const('obj', 'foo', 'call', 'at', capture.call);

  t.same(at, {
    file: 'capture-fixture.js',
    line: 29,
    column: 39,
    function: 'foo'
  });
  t.end();
});

t.test('at: returns empty object if #capture() returns an empty stack', t => {
  const stackUtil = new StackUtils();
  stackUtil.capture = () => [];
  t.same(stackUtil.at(), {});
  t.end();
});

t.test('at: eval', t => {
  const stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  const capture = new CaptureFixture(stackUtil);

  const at = capture.eval('call', 'at', capture.call);
  const expected = {
    line: 1,
    column: 13,
    evalOrigin: /eval at eval \(.*capture-fixture.js:38:12\)/,
    function: 'eval'
  };

  // TODO: There are some inconsistencies between this and how `parseLine` works.
  if (version[0] < 4) {
    expected.type = 'CaptureFixture';
    expected.function = 'eval';
  }

  t.match(at, expected);
  t.end();
});

t.test('parseLine', t => {
  const stack = new StackUtils({internals: internals(), cwd: '/user/dev/project'});
  const capture = new CaptureFixture(stack);

  t.same(stack.parseLine('foo'), null, 'should not match');

  t.same(stack.parseLine('    at bar (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    function: 'bar'
  });

  t.same(stack.parseLine('    at SomeClass.someFunc (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    function: 'SomeClass.someFunc'
  });

  // { "foo bar" () { throw new Error() } }
  t.same(stack.parseLine('    at Object.foo bar (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    function: 'Object.foo bar'
  });

  // Array.from({ *[Symbol.iterator] () { throw new Error() } })
  t.same(stack.parseLine('    at Object.[Symbol.iterator] (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    function: 'Object.[Symbol.iterator]'
  });

  t.same(stack.parseLine('    at foo (/some/other/dir/file.js:3:8)'), {
    file: '/some/other/dir/file.js',
    line: 3,
    column: 8,
    function: 'foo'
  });

  // TODO: report issue - this also causes power-assert diagram renderer to fail
  t.same(stack.parseLine('    at new Foo (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    constructor: true,
    function: 'Foo'
  });

  // EVAL
  const evalStack = capture.eval('error', 'foo').stack.split('\n');

  const expected = {
    file: '<anonymous>',
    line: 1,
    column: 13,
    evalOrigin: 'eval',
    evalLine: 38,
    evalColumn: 12,
    evalFile: path.join(utils.fixtureDir, 'capture-fixture.js').replace(/\\/g, '/'),
    function: 'eval'
  };

  if (version[0] < 4) {
    expected.function = 'CaptureFixture.eval';
  }

  const actual = stack.parseLine(evalStack[2]);

  t.match(actual, expected);
  t.end();
});

t.test('parseLine: handles native errors', t => {
  const stackUtils = new StackUtils();
  t.same(stackUtils.parseLine('    at Error (native)'), {
    native: true,
    function: 'Error'
  });
  t.end();
});

t.test('parseLine: handles parens', t => {
  const line = '    at X.<anonymous> (/USER/Db (Person)/x/y.js:14:11)';
  const stackUtils = new StackUtils();
  t.same(stackUtils.parseLine(line), {
    line: 14,
    column: 11,
    file: '/USER/Db (Person)/x/y.js',
    function: 'X.<anonymous>'
  });
  t.end();
});

function linuxStack1() {
  return [
    'Error: foo',
    '    at foo (/user/dev/project/foo.js:3:8)',
    '    at bar (/user/dev/project/foo.js:7:2)',
    '    at bar (/user/dev/project/bar.js:4:2)',
    '    at Object.<anonymous> (/user/dev/project/bar.js:7:1)'
  ];
}

function windowsStack1() {
  return [
    'Error: foo',
    '    at foo (Z:\\user\\dev\\project\\foo.js:3:8)',
    '    at bar (Z:\\user\\dev\\project\\foo.js:7:2)',
    '    at bar (Z:\\user\\dev\\project\\bar.js:4:2)',
    '    at Object.<anonymous> (Z:\\user\\dev\\project\\bar.js:7:1)'
  ];
}

function internalStack() {
  return [
    '    at ontimeout (timers.js:365:14)',
    '    at tryOnTimeout (timers.js:237:5)',
    '    at Timer.listOnTimeout (timers.js:207:5)',
    '    at _combinedTickCallback (internal/process/next_tick.js:67:7)',
    '    at process._tickCallback (internal/process/next_tick.js:98:9)',
    '    at Module.runMain (module.js:645:11)',
    '    at Module._compile (module.js:398:26)',
    '    at Object.Module._extensions..js (module.js:405:10)',
    '    at Module.load (module.js:344:32)',
    '    at Function.Module._load (module.js:301:12)',
    '    at Function.Module.runMain (module.js:430:10)',
    '    at module.js:430:10',
    '    at run (bootstrap_node.js:420:7)',
    '    at startup (bootstrap_node.js:139:9)',
    '    at bootstrap_node.js:535:3',
    '    at startup (node.js:141:18)'
  ];
}

function internals() {
  return StackUtils.nodeInternals().concat([
    /test\.js:\d+:\d+\)?$/,
    /\/node_modules\//
  ]);
}

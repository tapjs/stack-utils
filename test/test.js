var path = require('path');
var t = require('tap');
var StackUtils = require('../');
var CaptureFixture = require('./fixtures/capture-fixture');
var utils = require('./_utils');

// Use a fixed known set of native modules, since this changes
// depending on the version of Node we're testing with.
StackUtils.natives = [
  'internal/bootstrap_node',
  '_debug_agent',
  '_debugger',
  'assert',
  'buffer',
  'child_process',
  'console',
  'constants',
  'crypto',
  'cluster',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  '_http_agent',
  '_http_client',
  '_http_common',
  '_http_incoming',
  '_http_outgoing',
  '_http_server',
  'https',
  '_linklist',
  'module',
  'net',
  'os',
  'path',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  '_stream_readable',
  '_stream_writable',
  '_stream_duplex',
  '_stream_transform',
  '_stream_passthrough',
  '_stream_wrap',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  '_tls_common',
  '_tls_legacy',
  '_tls_wrap',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
  'internal/buffer',
  'internal/child_process',
  'internal/cluster',
  'internal/freelist',
  'internal/fs',
  'internal/linkedlist',
  'internal/net',
  'internal/module',
  'internal/process/next_tick',
  'internal/process/promises',
  'internal/process/stdio',
  'internal/process/warning',
  'internal/process',
  'internal/readline',
  'internal/repl',
  'internal/socket_list',
  'internal/url',
  'internal/util',
  'internal/v8_prof_polyfill',
  'internal/v8_prof_processor',
  'internal/streams/lazy_transform',
  'internal/streams/BufferList',
  'v8/tools/splaytree',
  'v8/tools/codemap',
  'v8/tools/consarray',
  'v8/tools/csvparser',
  'v8/tools/profile',
  'v8/tools/profile_view',
  'v8/tools/logreader',
  'v8/tools/tickprocessor',
  'v8/tools/SourceMap',
  'v8/tools/tickprocessor-driver',
  'bootstrap_node',
  'node'
];

var LinuxStack1 = utils.join(linuxStack1(), internalStack());
var WindowsStack1 = utils.join(windowsStack1(), internalStack());

var version = process.version.slice(1).split('.').map(function (val) {
  return parseInt(val, 10);
});

t.test('must be called with new', function (t) {
  t.is(typeof StackUtils, 'function');
  var stackUtils = StackUtils;
  t.throws(function () { stackUtils() });
  t.end()
});

t.test('clean: truncates cwd', function (t) {
  var expected = utils.join([
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
    'run (bootstrap_node.js:420:7)',
    'startup (bootstrap_node.js:139:9)',
    'bootstrap_node.js:535:3',
    'startup (node.js:141:18)'
  ]);

  var stack = new StackUtils({cwd: '/user/dev/project'});
  t.is(stack.clean(LinuxStack1), expected, 'accepts a linux string');
  t.is(stack.clean(LinuxStack1.split('\n')), expected, 'accepts an array');
  t.is(stack.clean(LinuxStack1.split('\n').slice(1)), expected, 'slices off the message line');

  stack = new StackUtils({cwd: 'Z:\\user\\dev\\project'});
  t.is(stack.clean(WindowsStack1), expected, 'accepts a windows string');
  t.end()
});

t.test('clean: eliminates internals', function (t) {
  var stack = new StackUtils({cwd: '/user/dev', internals: StackUtils.nodeInternals()});
  var expected = utils.join([
    'foo (project/foo.js:3:8)',
    'bar (project/foo.js:7:2)',
    'bar (project/bar.js:4:2)',
    'Object.<anonymous> (project/bar.js:7:1)'
  ]);
  t.is(stack.clean(LinuxStack1), expected);

  stack = new StackUtils({cwd: 'Z:\\user\\dev', internals: StackUtils.nodeInternals()});
  t.is(stack.clean(WindowsStack1), expected);
  t.end()
});

t.test('clean: returns null if it is all internals', function (t) {
  var stack = new StackUtils({internals: StackUtils.nodeInternals()});
  t.is(stack.clean(utils.join(internalStack())), '');
  t.end()
});

t.test('captureString: two redirects', function (t) {
  var stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stack);

  var capturedString = capture.redirect1('redirect2', 'call', 'captureString');
  t.is(capturedString, utils.join([
    'CaptureFixture.call (capture-fixture.js:23:28)',
    'CaptureFixture.redirect2 (capture-fixture.js:17:22)',
    'CaptureFixture.redirect1 (capture-fixture.js:11:22)'
  ]));
  t.end()
});

t.test('captureString: with startStack function', function (t) {
  var stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stack);

  var capturedString = capture.redirect1('redirect2', 'call', 'captureString', capture.call);
  t.is(capturedString, utils.join([
    'CaptureFixture.redirect2 (capture-fixture.js:17:22)',
    'CaptureFixture.redirect1 (capture-fixture.js:11:22)'
  ]));
  t.end()
});

t.test('captureString: with limit', function (t) {
  var stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stack);

  var capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1);
  t.is(capturedString, utils.join([
    'CaptureFixture.call (capture-fixture.js:23:28)'
  ]));
  t.end()
});

t.test('captureString: with limit and startStack', function (t) {
  var stack = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stack);

  var capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1, capture.call);
  t.is(capturedString, utils.join([
    'CaptureFixture.redirect2 (capture-fixture.js:17:22)'
  ]));
  t.end()
});

t.test('capture returns an array of call sites', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);
  var stack = capture.redirect1('call', 'capture').slice(0, 2);
  t.is(stack[0].getFileName(), path.join(utils.fixtureDir, 'capture-fixture.js'));
  t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
  t.is(stack[1].getFunctionName(), 'CaptureFixture.redirect1');
  t.end()
});

t.test('capture: with limit', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);
  var stack = capture.redirect1('redirect2', 'call', 'capture', 1);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
  t.end()
});

t.test('capture: with stackStart function', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);
  var stack = capture.redirect1('redirect2', 'call', 'capture', capture.call);
  t.true(stack.length > 1);
  t.is(stack[0].getFunctionName(), 'CaptureFixture.redirect2');
  t.end()
});

t.test('capture: with limit and stackStart function', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);
  var stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'CaptureFixture.redirect2');
  t.end()
});

t.test('capture: with wrapCallSite function', function (t) {
  var wrapper = function (callsite) {
    return {
      getMethodName: function () {
        return callsite.getMethodName();
      },
      getFunctionName: function () {
        return 'testOverrideFunctionName';
      }
    };
  };
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir, wrapCallSite: wrapper});
  var capture = new CaptureFixture(stackUtil);
  var stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
  t.is(stack.length, 1);
  t.is(stack[0].getFunctionName(), 'testOverrideFunctionName');
  t.is(stack[0].getMethodName(), 'redirect2');
  t.end()
});

t.test('at', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);
  var at = capture.redirect1('call', 'at');

  t.same(at, {
    file: 'capture-fixture.js',
    line: 23,
    column: 28,
    type: 'CaptureFixture',
    function: 'CaptureFixture.call',
    method: 'call'
  });
  t.end()
});

t.test('at: with stackStart', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: __dirname});
  var capture = new CaptureFixture(stackUtil);

  var at = capture.redirect1('call', 'at', capture.call);

  t.same(at, {
    file: 'fixtures/capture-fixture.js',
    line: 11,
    column: 22,
    type: 'CaptureFixture',
    function: 'CaptureFixture.redirect1',
    method: 'redirect1'
  });
  t.end()
});

t.test('at: inside a constructor call', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);

  var at = capture.const('call', 'at', capture.call);

  // TODO: File an issue - if this assert fails, the power assert diagram renderer blows up.
  t.same(at, {
    file: 'capture-fixture.js',
    line: 32,
    column: 27,
    constructor: true,
    type: 'Constructor',
    function: 'Constructor'
  });
  t.end()
});

t.test('at: method on an [Object] instance', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);

  var at = capture.const('obj', 'foo', 'call', 'at', capture.call);

  t.same(at, {
    file: 'capture-fixture.js',
    line: 46,
    column: 23,
    function: 'obj.(anonymous function)',
    method: 'foo'
  });
  t.end()
});

t.test('at: returns empty object if #capture() returns an empty stack', function (t) {
  var stackUtil = new StackUtils();
  stackUtil.capture = function () {
    return [];
  };
  t.same(stackUtil.at(), {});
  t.end()
});

t.test('at: eval', function (t) {
  var stackUtil = new StackUtils({internals: internals(), cwd: utils.fixtureDir});
  var capture = new CaptureFixture(stackUtil);

  var at = capture.eval('call', 'at', capture.call);
  var expected = {
    line: 1,
    column: 14,
    evalOrigin: /eval at (<anonymous>|CaptureFixture.eval) \(.*capture-fixture.js:57:9\)/,
    function: 'eval'
  };

  // TODO: There are some inconsistencies between this and how `parseLine` works.
  if (version[0] < 4) {
    expected.type = 'CaptureFixture';
    expected.function = 'eval';
  }

  t.match(at, expected);
  t.end()
});

t.test('parseLine', function (t) {
  var stack = new StackUtils({internals: internals(), cwd: '/user/dev/project'});
  var capture = new CaptureFixture(stack);

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
  })

  // Array.from({ *[Symbol.iterator] () { throw new Error() } })
  t.same(stack.parseLine('    at Object.[Symbol.iterator] (/user/dev/project/foo.js:3:8)'), {
    file: 'foo.js',
    line: 3,
    column: 8,
    function: 'Object.[Symbol.iterator]'
  })

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
  var evalStack = capture.eval('error', 'foo').stack.split('\n');

  var expected = {
    file: '<anonymous>',
    line: 1,
    column: 14,
    evalOrigin: /CaptureFixture.eval|<anonymous>/,
    evalLine: 57,
    evalColumn: 9,
    evalFile: path.join(utils.fixtureDir, 'capture-fixture.js').replace(/\\/g, '/'),
    function: 'eval'
  };

  if (version[0] < 4) {
    expected.function = 'CaptureFixture.eval';
  }

  var actual = stack.parseLine(evalStack[2]);

  t.match(actual, expected);
  t.end()
});

t.test('parseLine: handles native errors', function (t) {
  t.same(StackUtils.parseLine('    at Error (native)'), {
    native: true,
    function: 'Error'
  });
  t.end()
});

t.test('parseLine: handles parens', function (t) {
  var line = '    at X.<anonymous> (/USER/Db (Person)/x/y.js:14:11)';
  t.same(StackUtils.parseLine(line), {
    line: 14,
    column: 11,
    file: '/USER/Db (Person)/x/y.js',
    function: 'X.<anonymous>'
  });
  t.end()
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

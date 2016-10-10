import path from 'path';
import test from 'ava';
import StackUtils from '../';
import CaptureFixture from './fixtures/capture-fixture';
import {join, fixtureDir} from './_utils';

const LinuxStack1 = join(linuxStack1(), internalStack());
const WindowsStack1 = join(windowsStack1(), internalStack());

const version = process.version.slice(1).split('.').map(function (val) {
	return parseInt(val, 10);
});

test('must be called with new', t => {
	t.is(typeof StackUtils, 'function');
	const stackUtils = StackUtils;
	t.throws(() => stackUtils());
});

test('clean: truncates cwd', t => {
	const expected = join([
		'foo (foo.js:3:8)',
		'bar (foo.js:7:2)',
		'bar (bar.js:4:2)',
		'Object.<anonymous> (bar.js:7:1)',
		'Module._compile (module.js:398:26)',
		'Object.Module._extensions..js (module.js:405:10)',
		'Module.load (module.js:344:32)',
		'Function.Module._load (module.js:301:12)',
		'Function.Module.runMain (module.js:430:10)',
		'startup (node.js:141:18)'
	]);

	let stack = new StackUtils({cwd: '/user/dev/project'});
	t.is(stack.clean(LinuxStack1), expected, 'accepts a linux string');
	t.is(stack.clean(LinuxStack1.split('\n')), expected, 'accepts an array');
	t.is(stack.clean(LinuxStack1.split('\n').slice(1)), expected, 'slices off the message line');

	stack = new StackUtils({cwd: 'Z:\\user\\dev\\project'});
	t.is(stack.clean(WindowsStack1), expected, 'accepts a windows string');
});

test('clean: eliminates internals', t => {
	let stack = new StackUtils({cwd: '/user/dev', internals: StackUtils.nodeInternals()});
	var expected = join([
		'foo (project/foo.js:3:8)',
		'bar (project/foo.js:7:2)',
		'bar (project/bar.js:4:2)',
		'Object.<anonymous> (project/bar.js:7:1)'
	]);
	t.is(stack.clean(LinuxStack1), expected);

	stack = new StackUtils({cwd: 'Z:\\user\\dev', internals: StackUtils.nodeInternals()});
	t.is(stack.clean(WindowsStack1), expected);
});

test('clean: returns null if it is all internals', t => {
	const stack = new StackUtils({internals: StackUtils.nodeInternals()});
	t.is(stack.clean(join(internalStack())), '');
});

test('captureString: two redirects', t => {
	const stack = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stack);

	const capturedString = capture.redirect1('redirect2', 'call', 'captureString');
	t.is(capturedString, join([
		'CaptureFixture.call (capture-fixture.js:23:28)',
		'CaptureFixture.redirect2 (capture-fixture.js:17:22)',
		'CaptureFixture.redirect1 (capture-fixture.js:11:22)'
	]));
});

test('captureString: with startStack function', t => {
	const stack = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stack);

	const capturedString = capture.redirect1('redirect2', 'call', 'captureString', capture.call);
	t.is(capturedString, join([
		'CaptureFixture.redirect2 (capture-fixture.js:17:22)',
		'CaptureFixture.redirect1 (capture-fixture.js:11:22)'
	]));
});

test('captureString: with limit', t => {
	const stack = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stack);

	const capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1);
	t.is(capturedString, join([
		'CaptureFixture.call (capture-fixture.js:23:28)'
	]));
});

test('captureString: with limit and startStack', t => {
	const stack = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stack);

	const capturedString = capture.redirect1('redirect2', 'call', 'captureString', 1, capture.call);
	t.is(capturedString, join([
		'CaptureFixture.redirect2 (capture-fixture.js:17:22)'
	]));
});

test('capture returns an array of call sites', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);
	const stack = capture.redirect1('call', 'capture').slice(0, 2);
	t.is(stack[0].getFileName(), path.join(fixtureDir, 'capture-fixture.js'));
	t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
	t.is(stack[1].getFunctionName(), 'CaptureFixture.redirect1');
});

test('capture: with limit', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);
	const stack = capture.redirect1('redirect2', 'call', 'capture', 1);
	t.is(stack.length, 1);
	t.is(stack[0].getFunctionName(), 'CaptureFixture.call');
});

test('capture: with stackStart function', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);
	const stack = capture.redirect1('redirect2', 'call', 'capture', capture.call);
	t.true(stack.length > 1);
	t.is(stack[0].getFunctionName(), 'CaptureFixture.redirect2');
});

test('capture: with limit and stackStart function', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);
	const stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
	t.is(stack.length, 1);
	t.is(stack[0].getFunctionName(), 'CaptureFixture.redirect2');
});

test('capture: with wrapCallSite function', t => {
	var wrapper = function (frame) {
		var object = {};
		Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function (name) {
			object[name] = /^(?:is|get)/.test(name) ? function () {
				return frame[name];
			} : frame[name];
		});
		object.getFunctionName = function () {
			return 'testFunctionName';
		};
		return object;
	};
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir, wrapCallSite: wrapper});
	const capture = new CaptureFixture(stackUtil);
	const stack = capture.redirect1('redirect2', 'call', 'capture', 1, capture.call);
	t.is(stack.length, 1);
	t.is(stack[0].getFunctionName(), 'testFunctionName');
});

test('at', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);
	const at = capture.redirect1('call', 'at');

	t.same(at, {
		file: 'capture-fixture.js',
		line: 23,
		column: 28,
		type: 'CaptureFixture',
		function: 'CaptureFixture.call',
		method: 'call'
	});
});

test('at: with stackStart', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: __dirname});
	const capture = new CaptureFixture(stackUtil);

	const at = capture.redirect1('call', 'at', capture.call);

	t.same(at, {
		file: `fixtures/capture-fixture.js`,
		line: 11,
		column: 22,
		type: 'CaptureFixture',
		function: 'CaptureFixture.redirect1',
		method: 'redirect1'
	});
});

test('at: inside a constructor call', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);

	const at = capture.const('call', 'at', capture.call);

	// TODO: File an issue - if this assert fails, the power assert diagram renderer blows up.
	t.same(at, {
		file: 'capture-fixture.js',
		line: 32,
		column: 27,
		constructor: true,
		type: 'Constructor',
		function: 'Constructor'
	});
});

test('at: method on an [Object] instance', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);

	const at = capture.const('obj', 'foo', 'call', 'at', capture.call);

	t.same(at, {
		file: 'capture-fixture.js',
		line: 46,
		column: 23,
		function: 'obj.(anonymous function)',
		method: 'foo'
	});
});

test('at: returns empty object if #capture() returns an empty stack', t => {
	const stackUtil = new StackUtils();
	stackUtil.capture = function () {
		return [];
	};
	t.same(stackUtil.at(), {});
});

test('at: eval', t => {
	const stackUtil = new StackUtils({internals: internals(), cwd: fixtureDir});
	const capture = new CaptureFixture(stackUtil);

	const at = capture.eval('call', 'at', capture.call);
	const expected = {
		line: 1,
		column: 14,
		evalOrigin: 'eval at <anonymous> (' + path.join(fixtureDir, 'capture-fixture.js') + ':57:9)',
		function: 'eval'
	};

	// TODO: There are some inconsistencies between this and how `parseLine` works.
	if (version[0] < 4) {
		expected.type = 'CaptureFixture';
		expected.function = 'eval';
	}

	t.same(at, expected);
});

test('parseLine', t => {
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
		column: 14,
		evalOrigin: '<anonymous>',
		evalLine: 57,
		evalColumn: 9,
		evalFile: path.join(fixtureDir, 'capture-fixture.js').replace(/\\/g, '/'),
		function: 'eval'
	};

	if (version[0] < 4) {
		expected.function = 'CaptureFixture.eval';
	}

	const actual = stack.parseLine(evalStack[2]);

	t.same(actual, expected);
});

test('parseLine: handles native errors', t => {
	t.same(StackUtils.parseLine('    at Error (native)'), {
		native: true,
		function: 'Error'
	});
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
		'    at Module._compile (module.js:398:26)',
		'    at Object.Module._extensions..js (module.js:405:10)',
		'    at Module.load (module.js:344:32)',
		'    at Function.Module._load (module.js:301:12)',
		'    at Function.Module.runMain (module.js:430:10)',
		'    at startup (node.js:141:18)'
	];
}

function internals() {
	return StackUtils.nodeInternals().concat([
		/test\.js:\d+:\d+\)?$/,
		/\/node_modules\//
	]);
}

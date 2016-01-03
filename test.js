import test from 'ava';
import StackUtils from './';
import flatten from 'flatten';

const LinuxStack1 = join(linux1(), internals());
const WindowsStack1 = join(windows1(), internals());

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
	t.is(stack.clean(LinuxStack1), join([
		'foo (project/foo.js:3:8)',
		'bar (project/foo.js:7:2)',
		'bar (project/bar.js:4:2)',
		'Object.<anonymous> (project/bar.js:7:1)'
	]));

	stack = new StackUtils({cwd: 'Z:\\user\\dev', internals: StackUtils.nodeInternals()});
	t.is(stack.clean(WindowsStack1), join([
		'foo (project\\foo.js:3:8)',
		'bar (project\\foo.js:7:2)',
		'bar (project\\bar.js:4:2)',
		'Object.<anonymous> (project\\bar.js:7:1)'
	]));
});

test('clean: returns null if it is all internals', t => {
	let stack = new StackUtils({internals: StackUtils.nodeInternals()});
	t.is(stack.clean(join(internals())), null);
});

function join() {
	var args = Array.prototype.slice.call(arguments);
	return flatten(args).join('\n') + '\n';
}

function linux1() {
	return [
		'Error: foo',
		'    at foo (/user/dev/project/foo.js:3:8)',
		'    at bar (/user/dev/project/foo.js:7:2)',
		'    at bar (/user/dev/project/bar.js:4:2)',
		'    at Object.<anonymous> (/user/dev/project/bar.js:7:1)'
	];
}

function windows1() {
	return [
		'Error: foo',
		'    at foo (Z:\\user\\dev\\project\\foo.js:3:8)',
		'    at bar (Z:\\user\\dev\\project\\foo.js:7:2)',
		'    at bar (Z:\\user\\dev\\project\\bar.js:4:2)',
		'    at Object.<anonymous> (Z:\\user\\dev\\project\\bar.js:7:1)'
	];
}

function internals() {
	return [
		'    at Module._compile (module.js:398:26)',
		'    at Object.Module._extensions..js (module.js:405:10)',
		'    at Module.load (module.js:344:32)',
		'    at Function.Module._load (module.js:301:12)',
		'    at Function.Module.runMain (module.js:430:10)',
		'    at startup (node.js:141:18)'
	];
}


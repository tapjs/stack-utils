import test from 'ava';
import StackUtils from '../';
import longStackTraces from './fixtures/long-stack-traces';
import pify from 'pify';
const nestedErrors = pify(require('./fixtures/nested-errors'), Promise);

import {join, fixtureDir} from './_utils';

function internals() {
	return StackUtils.nodeInternals().concat([
		/\/long-stack-traces\.js:[0-9]+:[0-9]+\)?$/,
		/\/internal-error\.js:[0-9]+:[0-9]+\)?$/,
		/\/internal-then\.js:[0-9]+:[0-9]+\)?$/,
		/\/node_modules\//,
		// TODO: Should any of these be default internals?
		/\/\.node-spawn-wrap-\w+-\w+\/node:[0-9]+:[0-9]+\)?$/,
		/internal\/module\.js:[0-9]+:[0-9]+\)?$/,
		/node\.js:[0-9]+:[0-9]+\)?$/
	]);
}

const stackUtils = new StackUtils({internals: internals(), cwd: fixtureDir});

test('indents lines after first "From previous event:"', async t => {
	const cleanedStack = stackUtils.clean(await longStackTraces.bluebird);
	const expected = join([
		'mostInner (produce-long-stack-traces.js:10:5)',
		'From previous event:',
		'    evenMoreInner (produce-long-stack-traces.js:9:29)',
		'From previous event:',
		'    inner (produce-long-stack-traces.js:8:28)',
		'From previous event:',
		'    outer (produce-long-stack-traces.js:7:27)',
		'From previous event:',
		'    Object.<anonymous> (produce-long-stack-traces.js:6:36)'
	]);

	t.is(cleanedStack, expected);
});

test('removes empty "From previous event:" sections from the bottom', async t => {
	const stack = await longStackTraces.bluebird.bottom;
	const cleanedStack = stackUtils.clean(stack);

	const expected = join([
		'mostInner (produce-long-stack-traces.js:43:6)',
		'From previous event:',
		'    evenMoreInner (produce-long-stack-traces.js:42:30)',
		'From previous event:',
		'    inner (produce-long-stack-traces.js:41:29)',
		'From previous event:',
		'    outer (produce-long-stack-traces.js:40:28)'
	]);

	t.is(cleanedStack, expected);
});

test('removes empty "From previous event:" sections from the top', async t => {
	const stack = await longStackTraces.bluebird.top;
	const cleanedStack = stackUtils.clean(stack);

	const expected = join([
		'From previous event:',
		'    evenMoreInner (produce-long-stack-traces.js:33:29)',
		'From previous event:',
		'    inner (produce-long-stack-traces.js:32:28)',
		'From previous event:',
		'    outer (produce-long-stack-traces.js:31:27)',
		'From previous event:',
		'    Object.<anonymous> (produce-long-stack-traces.js:30:40)'
	]);

	t.is(cleanedStack, expected);
});

test('removes empty "From previous event:" sections from the middle', async t => {
	const stack = await longStackTraces.bluebird.middle;
	const cleanedStack = stackUtils.clean(stack);

	const expected = join([
		'mostInner (produce-long-stack-traces.js:22:5)',
		'From previous event:',
		'    evenMoreInner (produce-long-stack-traces.js:21:29)',
		'From previous event:',
		'    inner (produce-long-stack-traces.js:20:10)',
		'From previous event:',
		'    outer (produce-long-stack-traces.js:19:27)',
		'From previous event:',
		'    Object.<anonymous> (produce-long-stack-traces.js:18:43)'
	]);

	t.is(cleanedStack, expected);
});

test.cb('removes empty "Caused by:" sections from the top', t => {
	nestedErrors.top(stack => {
		const cleanedStack = stackUtils.clean(stack);

		const expected = join([
			'Caused By: Error: baz',
			'    Object.module.exports.top (nested-errors.js:36:5)'
		]);

		t.is(cleanedStack, expected);
		t.end();
	});
});

test.cb('removes empty "Caused by:" sections from the bottom', t => {
	nestedErrors.bottom(stack => {
		const cleanedStack = stackUtils.clean(stack);

		const expected = join([
			'nested (nested-errors.js:9:6)',
			'moreNested (nested-errors.js:15:3)',
			'Caused By: BarError: bar: internal',
			'    moreNested (nested-errors.js:15:6)'
		]);

		t.is(cleanedStack, expected);
		t.end();
	});
});

test.cb('removes empty "Caused by:" sections from the middle', t => {
	nestedErrors.middle(stack => {
		const cleanedStack = stackUtils.clean(stack);

		const expected = join([
			'nested-errors.js:41:6',
			'Caused By: Error: bar',
			'    Object.module.exports.middle (nested-errors.js:42:5)'
		]);

		t.is(cleanedStack, expected);
		t.end();
	});
});

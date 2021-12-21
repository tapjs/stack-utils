'use strict';

import NestedError from 'nested-error-stacks';
import util from 'util';
import internal from './internal-error.js';

function foo(cb) {
	bar(function nested(err) {
		cb(new FooError(`foo${err.message}`, err));
	});
}

function bar(cb) {
	internal(function moreNested(err) {
		cb(new BarError(`bar: ${err.message}`, err));
	});
}

function FooError(message, nested) {
	NestedError.call(this, message, nested);
}

util.inherits(FooError, NestedError);
FooError.prototype.name = 'FooError';

function BarError(message, nested) {
	NestedError.call(this, message, nested);
}

util.inherits(BarError, NestedError);
BarError.prototype.name = 'BarError';

export const top = function(cb) {
	internal(function (err) {
		cb(err.stack);
	}, new Error('baz'));
};

export const middle = function (cb) {
	internal(function (err) {
		cb(new FooError('foo', err).stack);
	}, new Error('bar'));
};

export const bottom = function (cb) {
	foo(function (err) {
		cb(err.stack);
	});
};

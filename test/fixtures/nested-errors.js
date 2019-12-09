'use strict';

const NestedError = require('nested-error-stacks');
const util = require('util');
const internal = require('./internal-error');

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

module.exports.top = function(cb) {
	internal(function (err) {
		cb(err.stack);
	}, new Error('baz'));
};

module.exports.middle = function (cb) {
	internal(function (err) {
		cb(new FooError('foo', err).stack);
	}, new Error('bar'));
};

module.exports.bottom = function (cb) {
	foo(function (err) {
		cb(err.stack);
	});
};

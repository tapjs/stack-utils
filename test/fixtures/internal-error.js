'use strict';
var NestedError = require('nested-error-stacks');
var util = require('util');

function InternalError(message, nested) {
	NestedError.call(this, message, nested);
}

util.inherits(InternalError, NestedError);
InternalError.prototype.name = 'InternalError';

module.exports = function (cb, err) {
	setTimeout(bound.bind(null, cb, err), 0);
};

function bound(cb, err) {
	cb(new InternalError('internal' + (err ? ': ' + err.message : ''), err));
}

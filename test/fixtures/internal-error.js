'use strict';
const NestedError = require('nested-error-stacks');

class InternalError extends NestedError {}

InternalError.prototype.name = 'InternalError';

module.exports = function (cb, err) {
	setTimeout(bound.bind(null, cb, err), 0);
};

function bound(cb, err) {
	cb(new InternalError('internal' + (err ? ': ' + err.message : ''), err));
}

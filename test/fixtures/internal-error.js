'use strict';
import NestedError from 'nested-error-stacks';
import util from 'util';

function InternalError(message, nested) {
	NestedError.call(this, message, nested);
}

util.inherits(InternalError, NestedError);
InternalError.prototype.name = 'InternalError';

export default function (cb, err) {
	setTimeout(bound.bind(null, cb, err), 0);
};

function bound(cb, err) {
	cb(new InternalError('internal' + (err ? ': ' + err.message : ''), err));
}

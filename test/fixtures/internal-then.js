'use strict';

export default function internalLibraryOuterFn(then) {
	return global.InternalPromise.resolve().then(function internalLibraryInnerFn() {
		return global.InternalPromise.resolve().then(then);
	});
};

export const reject = function internalLibraryOuterReject() {
	return global.InternalPromise.resolve().then(function internalLibraryInnerReject() {
		return global.InternalPromise.reject(new Error('inner')).catch(function (e) {
			return e.stack;
		});
	});
};

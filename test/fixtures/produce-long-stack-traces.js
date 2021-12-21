'use strict';
/* eslint no-undef: 0 */
const Promise = global.InternalPromise;
import internalThen from './internal-then.js';

export default Promise.resolve().then(function outer() {
	return Promise.resolve().then(function inner() {
		return Promise.resolve().then(function evenMoreInner() {
			return Promise.resolve().then(function mostInner() {
				a.b.c.d();
			}).catch(function catcher(e) {
				return e.stack;
			});
		});
	});
});

export const middle = Promise.resolve().then(function outer() {
	return Promise.resolve().then(function inner() {
		return internalThen(function evenMoreInner() {
			return Promise.resolve().then(function mostInner() {
				a.b.c.d();
			}).catch(function catcher(e) {
				return e.stack;
			});
		});
	});
});

export const top = Promise.resolve().then(function outer() {
	return Promise.resolve().then(function inner() {
		return Promise.resolve().then(function evenMoreInner() {
			return Promise.resolve().then(internalThen.reject);
		});
	});
});

export const bottom = new Promise(function (resolve) {
	setTimeout(internalThen.bind(null, function outer() {
		return Promise.resolve().then(function inner() {
			return Promise.resolve().then(function evenMoreInner() {
				return Promise.resolve().then(function mostInner() {
					a.b.c.d();
				}).catch(function catcher(e) {
					resolve(e.stack);
				});
			});
		});
	}), 0);
});

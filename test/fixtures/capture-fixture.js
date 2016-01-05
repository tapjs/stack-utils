'use strict';
module.exports = CaptureFixture;

function CaptureFixture(stack) {
	this.stack = stack;
}

CaptureFixture.prototype.redirect1 = function () {
	var args = Array.prototype.slice.call(arguments);
	var method = args.shift();
	return this[method].apply(this, args);
};

CaptureFixture.prototype.redirect2 = function () {
	var args = Array.prototype.slice.call(arguments);
	var method = args.shift();
	return this[method].apply(this, args);
};

CaptureFixture.prototype.call = function () {
	var args = Array.prototype.slice.call(arguments);
	var method = args.shift();
	return this.stack[method].apply(this.stack, args);
};

CaptureFixture.prototype.const = function () {
	var args = Array.prototype.slice.call(arguments);
	var method = args.shift();
	var self = this;

	function Constructor() {
		this.val = self[method].apply(self, args);
	}

	return new Constructor().val;
};

CaptureFixture.prototype.obj = function () {
	var args = Array.prototype.slice.call(arguments);
	var methodName = args.shift();
	var method = args.shift();
	var self = this;

	var obj = {};
	obj[methodName] = function () {
		return self[method].apply(self, args);
	};

	return obj[methodName]();
};

CaptureFixture.prototype.eval = function () {
	var args = Array.prototype.slice.call(arguments);
	var method = args.shift();
	var self = this;

	return eval('self[method].apply(self, args)');
};

CaptureFixture.prototype.error = function (message) {
	return new Error(message);
};

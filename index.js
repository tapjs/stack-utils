module.exports = StackUtils;

function StackUtils(opts) {
	if (!(this instanceof StackUtils)) {
		throw new Error('StackUtils constructor must be called with new');
	}
	opts = opts || {};
	this._cwd = opts.cwd || process.cwd();
	this._internals = opts.internals || [];
}

module.exports.nodeInternals = nodeInternals;

function nodeInternals() {
	// This was tap specific
	// /node_modules[\\\/]tap[\\\/](.*?)\.js:[0-9]:[0-9]\)?$/
	return [
		/\(domain.js:[0-9]+:[0-9]+\)$/,
		/\(events.js:[0-9]+:[0-9]+\)$/,
		/\(node.js:[0-9]+:[0-9]+\)$/,
		/\(timers.js:[0-9]+:[0-9]+\)$/,
		/\(module.js:[0-9]+:[0-9]+\)$/,
		/GeneratorFunctionPrototype.next \(native\)/
	];
}

StackUtils.prototype.clean = function (stack) {
	if (!Array.isArray(stack)) {
		stack = stack.split('\n');
	}

	if (!(/^\s*at /.test(stack[0])) &&
		(/^\s*at /.test(stack[1]))) {
		stack = stack.slice(1);
	}

	stack = stack.map(function (st) {
		var isInternal = this._internals.some(function (internal) {
			return internal.test(st);
		});

		if (isInternal) {
			return null;
		}

		return st.trim()
			.replace(/^\s*at /, '')
			.replace(this._cwd + '/', '')
			.replace(this._cwd + '\\', '');
	}, this).filter(function (st) {
		return st;
	}).join('\n').trim();

	if (stack) {
		return stack + '\n';
	}
	return null;
};

StackUtils.prototype.captureString = function (limit, fn) {
	if (typeof limit === 'function') {
		fn = limit;
		limit = Infinity;
	}
	if (!fn) {
		fn = this.captureString;
	}

	var limitBefore = Error.stackTraceLimit;
	if (limit) {
		Error.stackTraceLimit = limit;
	}

	var obj = {};

	Error.captureStackTrace(obj, fn);
	var stack = obj.stack;
	Error.stackTraceLimit = limitBefore;

	return this.clean(stack);
};

StackUtils.prototype.capture = function (limit, fn) {
	if (typeof limit === 'function') {
		fn = limit;
		limit = Infinity;
	}
	if (!fn) {
		fn = this.capture;
	}
	var prepBefore = Error.prepareStackTrace;
	var limitBefore = Error.stackTraceLimit;

	Error.prepareStackTrace = function (obj, site) {
		return site;
	};

	if (limit) {
		Error.stackTraceLimit = limit;
	}

	var obj = {};
	Error.captureStackTrace(obj, fn);
	var stack = obj.stack;
	Error.prepareStackTrace = prepBefore;
	Error.stackTraceLimit = limitBefore;

	return stack;
};

StackUtils.prototype.at = function at(fn) {
	if (!fn) {
		fn = at;
	}

	var site = this.capture(1, fn)[0];

	if (!site) {
		return {};
	}

	var res = {
		line: site.getLineNumber(),
		column: site.getColumnNumber()
	};

	var file = site.getFileName();
	if (file) {
		if (file.indexOf(this._cwd + '/') === 0 ||
			file.indexOf(this._cwd + '\\') === 0) {
			file = file.substr(this._cwd.length + 1);
		}
		res.file = file;
	}

	if (site.isConstructor()) {
		res.constructor = true;
	}

	if (site.isEval()) {
		res.evalOrigin = site.getEvalOrigin();
	}

	if (site.isNative()) {
		res.native = true;
	}

	var typename = null;
	try {
		typename = site.getTypeName();
	} catch (er) {}

	if (typename &&
		typename !== 'Object' &&
		typename !== '[object Object]') {
		res.type = typename;
	}

	var fname = site.getFunctionName();
	if (fname) {
		res.function = fname;
	}

	var meth = site.getMethodName();
	if (meth && fname !== meth) {
		res.method = meth;
	}

	return res;
};

var re = new RegExp(
	'^' +
		// Sometimes we strip out the '    at' because it's noisy
	'(?:\\s*at )?' +
		// $1 = ctor if 'new'
	'(?:(new) )?' +
		// Object.method [as foo] (, maybe
		// $2 = function name
		// $3 = method name
	'(?:([^\\(\\[]*)(?: \\[as ([^\\]]+)\\])? \\()?' +
		// (eval at <anonymous> (file.js:1:1),
		// $4 = eval origin
		// $5:$6:$7 are eval file/line/col, but not normally reported
	'(?:eval at ([^ ]+) \\(([^\\)]+):([0-9]+):([0-9]+)\\), )?' +
		// file:line:col
		// $8:$9:$10
		// $11 = 'native' if native
	'(?:([^\\)]+):([0-9]+):([0-9]+)|(native))' +
		// maybe close the paren, then end
	'\\)?$'
);

StackUtils.prototype.parseLine = function parseLine(line) {
	var match = line && line.match(re);
	if (!match) {
		return null;
	}

	var ctor = match[1] === 'new';
	var fname = match[2];
	var meth = match[3];
	var evalOrigin = match[4];
	var evalFile = match[5];
	var evalLine = Number(match[6]);
	var evalCol = Number(match[7]);
	var file = match[8];
	var lnum = match[9];
	var col = match[10];
	var native = match[11] === 'native';

	var res = {
		file: file,
		line: Number(lnum),
		column: Number(col)
	};

	if (res.file &&
		(res.file.indexOf(this._cwd + '/') === 0 ||
		res.file.indexOf(this._cwd + '\\') === 0)) {
		res.file = res.file.substr(this._cwd.length + 1);
	}

	if (ctor) {
		res.constructor = true;
	}

	if (evalOrigin) {
		res.evalOrigin = evalOrigin;
		res.evalLine = evalLine;
		res.evalColumn = evalCol;
		res.evalFile = evalFile;
	}

	if (native) {
		res.native = true;
	}

	if (fname) {
		res.function = fname;
	}

	if (meth && fname !== meth) {
		res.method = meth;
	}

	return res;
};

var bound = new StackUtils();

Object.keys(StackUtils.prototype).forEach(function (key) {
	StackUtils[key] = bound[key].bind(bound);
});

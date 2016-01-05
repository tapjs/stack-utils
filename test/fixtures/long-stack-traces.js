'use strict';

var Q = require('q');
Q.longStackSupport = true;
global.InternalPromise = Q;
module.exports.q = require('./produce-long-stack-traces');

var longStackTracePath = require.resolve('./produce-long-stack-traces');
var internalThen = require.resolve('./internal-then');
delete require.cache[longStackTracePath];
delete require.cache[internalThen];

var bluebird = require('bluebird');
bluebird.config({longStackTraces: true});
global.InternalPromise = bluebird;
module.exports.bluebird = require('./produce-long-stack-traces');

'use strict';

const Q = require('q');
Q.longStackSupport = true;
global.InternalPromise = Q;
module.exports.q = require('./produce-long-stack-traces');

const longStackTracePath = require.resolve('./produce-long-stack-traces');
const internalThen = require.resolve('./internal-then');
delete require.cache[longStackTracePath];
delete require.cache[internalThen];

const bluebird = require('bluebird');
bluebird.config({longStackTraces: true});
global.InternalPromise = bluebird;
module.exports.bluebird = require('./produce-long-stack-traces');

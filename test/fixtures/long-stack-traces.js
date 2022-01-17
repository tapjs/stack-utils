'use strict';

import Q from 'q';
Q.longStackSupport = true;
global.InternalPromise = Q;
export * from './produce-long-stack-traces.js';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const longStackTracePath = require.resolve('./produce-long-stack-traces');
const internalThen = require.resolve('./internal-then');
delete require.cache[longStackTracePath];
delete require.cache[internalThen];

import bluebird from 'bluebird';
bluebird.config({longStackTraces: true});
global.InternalPromise = bluebird;
export * as bluebird from './produce-long-stack-traces';

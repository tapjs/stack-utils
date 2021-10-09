const test = require('ava');
const { stripIndent } = require('common-tags');

const { parseErrors, printErrors } = require('../../lib/v8');

test('can reprint a string error', (t) => {
  const stack = stripIndent`
  ReferenceError: a is not defined
      at mostInner (/home/conartist6/dev/repos/stack-utils/test/fixtures/produce-long-stack-traces.js:10:5)
  From previous event:
      at evenMoreInner (/home/conartist6/dev/repos/stack-utils/test/fixtures/produce-long-stack-traces.js:9:29)
  From previous event:
      at inner (/home/conartist6/dev/repos/stack-utils/test/fixtures/produce-long-stack-traces.js:8:28)
  From previous event:
      at outer (/home/conartist6/dev/repos/stack-utils/test/fixtures/produce-long-stack-traces.js:7:27)
      at processImmediate (internal/timers.js:464:21)
  From previous event:
      at Object.<anonymous> (/home/conartist6/dev/repos/stack-utils/test/fixtures/produce-long-stack-traces.js:6:36)
      at Module._compile (internal/modules/cjs/loader.js:1072:14)
      at Module._extensions..js (internal/modules/cjs/loader.js:1101:10)
      at Object.require.extensions.<computed> [as .js] (/home/conartist6/dev/repos/stack-utils/node_modules/ava/lib/worker/dependency-tracker.js:42:4)
      at Module.load (internal/modules/cjs/loader.js:937:32)
      at Function.Module._load (internal/modules/cjs/loader.js:778:12)
      at Module.require (internal/modules/cjs/loader.js:961:19)
      at require (internal/modules/cjs/helpers.js:92:18)
      at Object.<anonymous> (/home/conartist6/dev/repos/stack-utils/test/fixtures/long-stack-traces.js:16:27)
      at Module._compile (internal/modules/cjs/loader.js:1072:14)
      at Module._extensions..js (internal/modules/cjs/loader.js:1101:10)
      at Object.require.extensions.<computed> [as .js] (/home/conartist6/dev/repos/stack-utils/node_modules/ava/lib/worker/dependency-tracker.js:42:4)
      at Module.load (internal/modules/cjs/loader.js:937:32)
      at Function.Module._load (internal/modules/cjs/loader.js:778:12)
      at Module.require (internal/modules/cjs/loader.js:961:19)
      at require (internal/modules/cjs/helpers.js:92:18)
      at Object.<anonymous> (/home/conartist6/dev/repos/stack-utils/test/long-stack-traces.js:6:25)
      at Module._compile (internal/modules/cjs/loader.js:1072:14)
      at Module._extensions..js (internal/modules/cjs/loader.js:1101:10)`;

  t.is(printErrors(parseErrors(stack)), stack);
});

'use strict';

const t = require('tap');
const StackUtils = require('../');

const utils = require('./_utils');

const stackUtils = new StackUtils({ cwd: '/home/user' });

t.test('removes namespaced internal modules', t => {
  const stack = utils.join([
    'at Test.<anonymous> (test/test.js:99:5)',
    'at TapWrap.runInAsyncScope (node:async_hooks:193:9)',
    'at Object.<anonymous> (test/test.js:94:3)',
    'at Module._compile (node:internal/modules/cjs/loader:1083:30)',
    'at Module.replacementCompile (node_modules/append-transform/index.js:58:13)',
    'at Module._extensions..js (node:internal/modules/cjs/loader:1112:10)',
    'at Object.<anonymous> (node_modules/append-transform/index.js:62:4)',
    'at Module.load (node:internal/modules/cjs/loader:948:32)',
    'at Function.Module._load (node:internal/modules/cjs/loader:789:14)',
    'at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:72:12)',
    'at Module._compile (node:internal/modules/cjs/loader:1083:30)',
    'at Object.Module._extensions..js (node:internal/modules/cjs/loader:1112:10)',
    'at Module.load (node:internal/modules/cjs/loader:948:32)',
    'at Function.Module._load (node:internal/modules/cjs/loader:789:14)',
    'at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:72:12)',
    'at Module._compile (node:internal/modules/cjs/loader:1083:30)',
    'at Object.Module._extensions..js (node:internal/modules/cjs/loader:1112:10)',
    'at Module.load (node:internal/modules/cjs/loader:948:32)',
    'at Function.Module._load (node:internal/modules/cjs/loader:789:14)',
    'at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:72:12)',
    'at node:internal/main/run_main_module:17:47'
  ]);
  const expectedStack = utils.join([
    'Test.<anonymous> (test/test.js:99:5)',
    'Object.<anonymous> (test/test.js:94:3)',
    'Module.replacementCompile (node_modules/append-transform/index.js:58:13)',
    'Object.<anonymous> (node_modules/append-transform/index.js:62:4)',
  ])
  t.plan(1);
  t.equal(stackUtils.clean(stack), expectedStack);
});

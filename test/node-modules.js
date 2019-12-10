'use strict';

const t = require('tap');
const arg = require('arg');

const StackUtils = require('../');

function clean(stack, ...ignoredPackages) {
  const stackUtil = new StackUtils({ignoredPackages});

  return stackUtil.clean(stack);
}

try {
  // This is being used as an easy to test error being thrown by a node_module.
  arg();
} catch (e) {
  t.match(clean(e.stack), 'node_modules/arg/');
  t.notMatch(clean(e.stack, 'arg'), 'node_modules/arg/');
  t.match(clean(e.stack, 'resolve-from'), 'node_modules/arg/');
  t.notMatch(clean(e.stack, 'arg', 'resolve-from'), 'node_modules/arg/');
  t.notMatch(clean(e.stack, 'resolve-from', 'arg'), 'node_modules/arg/');
}

'use strict';

const t = require('tap');

const StackUtils = require('../');

function helper(fromModule, ignoredPackages) {
  const stackUtil = new StackUtils({ignoredPackages});

  const result = stackUtil.clean('Error: Simulated\n' +
    `    at fn (/usr/src/stack-utils/node_modules/${fromModule}/index.js:1:1)\n`);
  if (ignoredPackages.includes(fromModule)) {
    t.notMatch(result, `node_modules/${fromModule}/`);
  } else {
    t.match(result, `node_modules/${fromModule}/`);
  }
}

const modules = ['arg', 'resolve-from', '@scoped/module'];
for (const mod of modules) {
  helper(mod, []);
  helper(mod, [mod]);
  helper(mod, modules.filter(m => m !== mod));
  helper(mod, modules);
}

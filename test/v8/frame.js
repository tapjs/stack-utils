'use strict';

const test = require('ava');
const cases = require('./fixtures/frame.json');
const { parseFrame, printFrame } = require('../../lib/v8');

const someOnly = cases.some(({ only }) => only);

for (const { object, string, stringNormal = string, strict, only } of cases) {
  if (!someOnly || only) {
    const printable = JSON.stringify(string).slice(1, -1);

    test(printable.replace(/^[ \t]*at[ \t]+/, ''), (t) => {
      const expected = object;

      t.deepEqual(parseFrame(string), expected);

      t.is(printFrame(object), stringNormal);
    });
  }
}

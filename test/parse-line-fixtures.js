'use strict';

import t from 'tap';
import fs from 'fs';
import StackUtils from '../index.js';

const stack = new StackUtils();

const cases = JSON.parse(fs.readFileSync('./test/fixtures/parse-fixture.json'));
const lines = Object.keys(cases);

t.plan(lines.length * 2);
lines.forEach(line => {
  const expect = cases[line];
  t.match(stack.parseLine(line), expect, JSON.stringify(line));
  line = line.replace(/^ {4}at /, '');
  t.match(stack.parseLine(line), expect, JSON.stringify(line));
});

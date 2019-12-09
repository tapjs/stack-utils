'use strict';
// Run this file to re-generate the parse fixture json after changes.

const lines = new Set();
const basename = require('path').basename(__filename);
const lineRE = new RegExp('\\b' + basename + ':([0-9]+):([0-9]+)\\b', 'g');
const capture = e => e.stack.split('\n').forEach(line => {
  if (line === 'Error: ok')
    return;

  lines.add(
    line
      .split(__dirname).join('__dirname')
      .replace(lineRE, basename + ':420:69')
  );
});

const done = _ => {
  const StackUtils = require('../..');
  const stack = new StackUtils();
  const obj = Object.create(null);
  lines.forEach(line => {
    obj[line] = stack.parseLine(line);
  });
  const fs = require('fs');
  const json = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(__dirname + '/parse-fixture.json', json);
};

{
  const s = Symbol('foo');
  const o = { [s] () { throw new Error('ok'); } };
  try {
    o[s]();
  } catch (e) {
    capture(e);
  }
}

{
  const o = { ['asdf ][)( \u0000\u0001\u0002\u0003\u001b[44;37m foo'] () { throw new Error('ok'); } };
  try {
    o['asdf ][)( \u0000\u0001\u0002\u0003\u001b[44;37m foo']();
  } catch (e) {
    capture(e);
  }
}

{
  const s = 'asdf (' + __filename + ':1:9999)';
  const o = { [s] () { throw new Error('ok'); } };
  try {
    o[s]();
  } catch (e) {
    capture(e);
  }
}

{
  const s = 'eval';
  const o = { [s] () { throw new Error('ok'); } };
  try {
    eval('o[s]()');
  } catch (e) {
    capture(e);
  }
}

{
  const vm = require('vm');
  const code = 'function fooeval () { eval("o[s]()") }; fooeval()';
  const s = 'a (s) d [f]';
  const o = { [s] () { throw new Error('ok'); } };
  try {
    vm.runInNewContext(code, {o, s}, { filename: 'a file with eval .js' });
  } catch (e) {
    capture(e);
  }
}

{
  const vm = require('vm');
  const code = 'eval("o[s]()")';
  const s = 'a (s) d [f]';
  const o = { [s] () { throw new Error('ok'); } };
  try {
    vm.runInNewContext(code, {o, s}, { filename: 'a file with eval .js' });
  } catch (e) {
    capture(e);
  }
}

{
  const s = 'function ctor (file.js:1:2)     <anonymous>';
  const o = { [s] () { throw new Error('ok'); } };
  try {
    new Function('o', 's', 'o[s]()')(o, s);
  } catch (e) {
    capture(e);
  }
}

{
  const s = Symbol.iterator;
  const o = { [s] () { throw new Error('ok'); } };
  try {
    new Function('o', 's', 'o[s]()')(o, s);
  } catch (e) {
    capture(e);
  }
}

{
  const s = Symbol.iterator;
  const o = new class Classy { [s] () { throw new Error('ok'); } };
  try {
    new Function('o', 's', 'o[s]()')(o, s);
  } catch (e) {
    capture(e);
  }
}

{
  const s = Symbol('some (weird) [<symbolism>]');
  const o = new class Classy { [s] () { throw new Error('ok'); } };
  try {
    const x = o[s];
    x();
  } catch (e) {
    capture(e);
  }
}

{
  const s = Symbol('some (weird) [<symbolism>]');
  const o = new class Classy { [s] () { throw new Error('ok'); } };
  try {
    const x = { foo: o[s] };
    x.foo();
  } catch (e) {
    capture(e);
  }
}

{
  const s = Symbol('some (weird) [<symbolism>]');
  const o = new class Classy { [s] () { throw new Error('ok'); } };
  try {
    const x = new class OtherClass { constructor() { this.foo = o[s]; } };
    x.foo();
  } catch (e) {
    capture(e);
  }
}

{
  const vm = require('vm');
  const o = { ['a (w) [<s>]'] () { throw new Error('ok'); } };
  try {
    vm.runInNewContext('o["a (w) [<s>]"]()', { o: o });
  } catch (e) {
    capture(e);
  }
}

{
  const vm = require('vm');
  const o = { ['a (w) [<s>]'] () { throw new Error('ok'); } };
  try {
    vm.runInNewContext(
      'function x () { o["a (w) [<s>]"]() }\n' +
      'x()', { o: o }, {
      filename: '     f[i](l<e>:.js:1:2)    '
    });
  } catch (e) {
    capture(e);
  }
}

{
  class Foo {
    constructor () {
      throw new Error('ok');
    }
  }
  try {
    new Foo();
  } catch (e) {
    capture(e);
  }
}

{
  class Foo {
    constructor (n) {
      this.n = n;
      throw new Error('ok');
    }
  }
  const arr = [1, 2, 3];
  try {
    arr.map(n => new Foo(n));
  } catch (e) {
    capture(e);
  }
}

done();

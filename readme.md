# stack-utils [![Build Status](https://travis-ci.org/jamestalmage/stack-utils.svg?branch=master)](https://travis-ci.org/jamestalmage/stack-utils) [![Coverage Status](https://coveralls.io/repos/jamestalmage/stack-utils/badge.svg?branch=master&service=github)](https://coveralls.io/github/jamestalmage/stack-utils?branch=master)

> Captures and cleans stack traces.

Extracted from `lib/stack.js` in the [`node-tap` project](https://github.com/tapjs/node-tap)

## Install

```
$ npm install --save stack-utils
```


## Usage

```js
const StackUtils = require('stack-utils');
const stack = new StackUtils({cwd: process.cwd(), internals: StackUtils.nodeInternals()});

console.log(stack.clean(new Error().stack));
// outputs a beutified stack trace
```


## API

### stackUtils(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## License

MIT © [James Talmage](http://github.com/jamestalmage)

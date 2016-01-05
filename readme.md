# stack-utils 

> Captures and cleans stack traces.

[![Linux Build](https://travis-ci.org/jamestalmage/stack-utils.svg?branch=master)](https://travis-ci.org/jamestalmage/stack-utils) [![Windows Build](https://ci.appveyor.com/api/projects/status/6ceryao6d7o7kp86/branch/master?svg=true)](https://ci.appveyor.com/project/jamestalmage/stack-utils/branch/master) [![Coverage](https://coveralls.io/repos/jamestalmage/stack-utils/badge.svg?branch=master&service=github)](https://coveralls.io/github/jamestalmage/stack-utils?branch=master)


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

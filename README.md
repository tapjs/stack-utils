# stack-utils

`stack-utils` provides utilites for printing and parsing errors and their stacks.

## Usage

```js
import { printErrors } from 'stack-utils';

try {
  const baseError = new Error('base');
  const wrapperError = new Error('wrapper');
  baseError.cause = wrapperError;

  throw wrapperError;
} catch (e) {
  console.error(printErrors(error));
  // Error: wrapper
  //    at <anonymous>:5:28
  // Caused by: Error: base
  //    at <anonymous>:4:25
}
```

## API

The general API provides two methods:

`printError(error)` prints `` `${error.name}: ${error.message}\n${error.stack}` ``
`printErrors(error)` recursively prints `` `${printError(error)}\nCaused by: ${printError(error.cause)}` ``

## Platform-specific API

Currently the only supported platform is `v8`.

The platform-specific API allows parsing and reprinting of errors. **Parsing errors is a best-effort process, and you must never use the results of parsing an error to define business logic. The only supported usage of output from parseError is as input to printError.** These APIs exist to allow you to reformat errors which may contain unnecessary cruft, and their current usages are in test frameworks like `jest` and `ava`.

Such a usage might look like this:

```js
import { parseErrors } from 'stack-utils/v8';

try {
  doStuff();
} catch (e) {
  const errors = parseErrors(e);

  for (const error of errors) {
    error.stack = error.stack.filter(
      (frame) => frame.site.type !== 'native',
    );
  }

  console.error(printErrors(errors));
}
```

`parseError` returns a parsed error.
`parseErrors` returns an array of parsed errors.

Full documentation of platform-specific APIs does not yet exist, but the tests are instructive as to the shape of parsed errors and stack frames.

## License

MIT © [Conrad Buck](https://github.com/conartist6) [Isaac Z. Schlueter](https://github.com/isaacs), [James Talmage](https://github.com/jamestalmage)

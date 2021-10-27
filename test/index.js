const test = require('ava');

const {
  printErrorHeader,
  printErrorHeaders,
  printError,
  printErrors,
  printFrames,
} = require('../lib');

const testCauseName = 'Error';
const testCauseMessage = 'the system is down';
const testCauseHeader = `${testCauseName}: ${testCauseMessage}`;
const testCauseFrames = `    at native`;
const testCauseStack = `${testCauseHeader}\n${testCauseFrames}`;
const testCause = new Error(testCauseMessage);

testCause.stack = testCauseStack;

class TestError extends Error {
  get name() {
    return 'TestError';
  }
}

const testErrorName = 'TestError';
const testErrorMessage = '¯\\_(ツ)_/¯';
const testErrorHeader = `${testErrorName}: ${testErrorMessage}`;
const testErrorFrames = `    at <anonymous> (test/index.js:1:1)\n    at buildTestError (test/index.js:2:1)`;
const testErrorStack = `${testErrorHeader}\n${testErrorFrames}`;

const testError = new TestError(testErrorMessage);

testError.stack = testErrorStack;
testError.cause = testCause;

test('can print an error header', (t) => {
  t.is(printErrorHeader(testError), testErrorHeader);
});

test('can print a chain of error headers', (t) => {
  const expected = `${testErrorHeader}\nCaused by: ${testCauseHeader}`;
  t.is(printErrorHeaders(testError), expected);
});

test('can print an error', (t) => {
  t.is(printError(testError), testErrorStack);
});

test('can print a chain of errors', (t) => {
  const expected = `${testErrorStack}\nCaused by: ${testCauseStack}`;
  t.is(printErrors(testError), expected);
});

test("can print an error's stack frames", (t) => {
  t.is(printFrames(testError), testErrorFrames);
});

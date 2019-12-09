'use strict';

class CaptureFixture {
  constructor (stack) {
    this.stack = stack;
  }

  redirect1 (method, ...args) {
    return this[method](...args);
  }

  redirect2 (method, ...args) {
    return this[method](...args);
  }

  const (method, ...args) {
    const self = this;
    class Constructor {
      constructor () {
        this.val = self[method](...args);
      }
    }

    return new Constructor().val;
  }

  obj (methodName, method, ...args) {
    const obj = {
      [methodName]: () => this[method](...args)
    };

    return obj[methodName]();
  }

  eval (method, ...args) {
    const self = this;

    return eval('self[method](...args)');
  }

  error (message) {
    return new Error(message);
  }
}

CaptureFixture.prototype.call = function (method, ...args) {
  return this.stack[method](...args);
};

module.exports = CaptureFixture;

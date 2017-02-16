'use strict'
module.exports = CaptureFixture

function CaptureFixture (stack) {
  this.stack = stack
}

CaptureFixture.prototype.redirect1 = function () {
  const args = Array.prototype.slice.call(arguments)
  const method = args.shift()
  return this[method].apply(this, args)
}

CaptureFixture.prototype.redirect2 = function () {
  const args = Array.prototype.slice.call(arguments)
  const method = args.shift()
  return this[method].apply(this, args)
}

CaptureFixture.prototype.call = function () {
  const args = Array.prototype.slice.call(arguments)
  const method = args.shift()
  return this.stack[method].apply(this.stack, args)
}

CaptureFixture.prototype.const = function () {
  const args = Array.prototype.slice.call(arguments)
  const method = args.shift()
  const self = this

  function Constructor () {
    this.val = self[method].apply(self, args)
  }

  return new Constructor().val
}

CaptureFixture.prototype.obj = function () {
  const args = Array.prototype.slice.call(arguments)
  const methodName = args.shift()
  const method = args.shift()
  const self = this

  const obj = {}
  obj[methodName] = function () {
    return self[method].apply(self, args)
  }

  return obj[methodName]()
}

CaptureFixture.prototype.eval = function () {
  const args = Array.prototype.slice.call(arguments)
  const method = args.shift() // eslint-disable-line no-unused-vars
  const self = this // eslint-disable-line no-unused-vars

  return eval('self[method].apply(self, args)') // eslint-disable-line no-eval
}

CaptureFixture.prototype.error = function (message) {
  return new Error(message)
}

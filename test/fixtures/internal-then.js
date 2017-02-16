
// var p = global.InternalPromise.resolve().then(function () {});

module.exports = function internalLibraryOuterFn (then) {
  return global.InternalPromise.resolve().then(function internalLibraryInnerFn () {
    return global.InternalPromise.resolve().then(then)
  })
}

module.exports.reject = function internalLibraryOuterReject () {
  return global.InternalPromise.resolve().then(function internalLibraryInnerReject () {
    return global.InternalPromise.reject(new Error('inner')).catch(e => e.stack)
  })
}

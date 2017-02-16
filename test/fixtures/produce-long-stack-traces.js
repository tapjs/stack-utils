'use strict'

const Promise = global.InternalPromise
const internalThen = require('./internal-then')

module.exports = Promise.resolve().then(function outer () {
  return Promise.resolve().then(function inner () {
    return Promise.resolve().then(function evenMoreInner () {
      return Promise.resolve().then(function mostInner () {
        a.b.c.d() // eslint-disable-line no-undef
      }).catch(function catcher (e) {
        return e.stack
      })
    })
  })
})

module.exports.middle = Promise.resolve().then(function outer () {
  return Promise.resolve().then(function inner () {
    return internalThen(function evenMoreInner () {
      return Promise.resolve().then(function mostInner () {
        a.b.c.d() // eslint-disable-line no-undef
      }).catch(function catcher (e) {
        return e.stack
      })
    })
  })
})

module.exports.top = Promise.resolve().then(function outer () {
  return Promise.resolve().then(function inner () {
    return Promise.resolve().then(function evenMoreInner () {
      return Promise.resolve().then(internalThen.reject)
    })
  })
})

module.exports.bottom = new Promise(resolve => {
  setTimeout(internalThen.bind(null, function outer () {
    return Promise.resolve().then(function inner () {
      return Promise.resolve().then(function evenMoreInner () {
        return Promise.resolve().then(function mostInner () {
          a.b.c.d() // eslint-disable-line no-undef
        }).catch(function catcher (e) {
          resolve(e.stack)
        })
      })
    })
  }), 0)
})

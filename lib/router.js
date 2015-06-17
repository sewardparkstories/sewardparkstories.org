var hashMatch = require('hash-match')

module.exports = function () {
  var router = require('wayfarer')('/')

  router.start = function () {
    router.match(hashMatch(window.location.hash))
    window.addEventListener('hashchange', function (e) {
      router.match(hashMatch(window.location.hash))
    })
  }

  router.go = function (path) {
    window.location.hash = path
  }

  return router
}
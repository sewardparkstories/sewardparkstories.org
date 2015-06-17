var h = require('virtual-dom/h')

module.exports = function (id, content) {
  var closeButton = require('../lib/close-button')()
  return h('div#' + id, { className: 'page' }, [
    require('./actions')(closeButton),
    closeButton.vtree,
    h('div.scroller', content)
  ])
}
var h = require('virtual-dom/h')

module.exports = function (id, state, content) {
  var closeButton = require('../lib/close-button')(state)
  return h('div#' + id, { className: 'page' }, [
    require('./actions')(closeButton, state),
    closeButton.vtree,
    h('div.scroller', content)
  ])
}

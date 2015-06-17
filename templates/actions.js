var h = require('virtual-dom/h')

module.exports = function () {
  return h('ul.actions', [
    h('li', [h('img.logo-small', { src: 'assets/logo.png' })]),
    h('li', [h('a', { href: "#/about" }, 'about')]),
    h('li', [h('a', { href: "#/list" }, 'list')]),
    h('li', [h('a', { href: "#/nearby" }, 'nearby')])
  ])
}
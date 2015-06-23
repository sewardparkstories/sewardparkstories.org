var h = require('virtual-dom/h')
var elClass = require('element-class')
var layout = require('./layout')

module.exports = function (state) {
  function onclick (e) {
    var tags = document.querySelectorAll('.filter a')
    var i=0
    var l = tags.length
    for (i; i<l; i++) {
      elClass(tags[i]).remove('active')
    }
    elClass(e.target).add('active')
  }

  return layout('list', state, [
    h('h1', 'Locations'),
    h('ul.filter', [
      h('li', [h('a', { onclick: onclick, href: '#/list' }, 'all')]),
      h('li', [h('a', { onclick: onclick, href: '#/list/culture' }, 'culture')]),
      h('li', [h('a', { onclick: onclick, href: '#/list/ecology' }, 'ecology')]),
      h('li', [h('a', { onclick: onclick, href: '#/list/landscape' }, 'landscape')]),
    ]),
    state.list
  ])
}

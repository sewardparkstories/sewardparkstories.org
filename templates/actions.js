var h = require('virtual-dom/h')

module.exports = function (closeButton, state) {
  var actions = ['about', 'list'] 

  function onclick (e) {
    if (closeButton) closeButton.show(null, state)
  }

  var items = [h('li.logo', [
    h('a', { href: '#', onclick: onclick }, [
      h('img.logo-small', { src: 'assets/logo.png' })
    ])
  ])]

  actions.forEach(function (action) {
    items.push(h('li', [
      h('a', { href: '#/'+action, onclick: onclick }, action)
    ]))
  })

  return h('ul.actions', items)
}
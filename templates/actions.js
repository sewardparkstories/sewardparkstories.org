var h = require('virtual-dom/h')

module.exports = function (closeButton) {
  var actions = ['about', 'list', 'nearby'] 
  
  function onclick (e) {
    closeButton.show()
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
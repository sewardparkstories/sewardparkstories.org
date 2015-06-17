var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (state) {
  return layout('list', state, [
    h('h1', 'Locations'),
    state.list
  ])
}
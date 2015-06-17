var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (state) {
  return layout('nearby', state, [
    h('h1', 'nearby')
  ])
}
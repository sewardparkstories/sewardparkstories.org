var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (data) {
  return layout('nearby', [
    h('h1', 'nearby')
  ])
}
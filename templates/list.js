var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (list) {
  return layout('list', [
    h('h1', 'Locations'),
    list
  ])
}
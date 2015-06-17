var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (data) {
  return layout('list', [
    h('h1', 'list')
  ])
}
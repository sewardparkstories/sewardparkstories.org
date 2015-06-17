var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (data) {
  return layout('error', [
    h('h1', 'error')
  ])
}
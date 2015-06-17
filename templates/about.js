var h = require('virtual-dom/h')
var layout = require('./layout')

module.exports = function (data) {
  return layout('about', [
    h('h1', 'About Sqebeqsed Stories')
  ])
}
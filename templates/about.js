var fs = require('fs')
var h = require('virtual-dom/h')
var vdom = require('vdom-virtualize').fromHTML
var layout = require('./layout')

module.exports = function (state) {
  return layout('about', state, [
    h('h1', 'About Sqebeqsed Stories'),
    h('div.about-text', vdom(fs.readFileSync(__dirname + '/about.html').toString()))
  ])
}
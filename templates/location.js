var h = require('virtual-dom/h')
var layout = require('./layout')
var vdom = require('vdom-virtualize').fromHTML
var md = require('marked')

module.exports = function (state) {
  return layout('location', state, [
    h('h1', state.item.title),
    h('div.location-content', vdom(md(state.item.text)))
  ])
}
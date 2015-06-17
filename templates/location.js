var h = require('virtual-dom/h')
var layout = require('./layout')
var vdom = require('vdom-virtualize').fromHTML
var md = require('marked')

module.exports = function (data) {
  console.log(vdom(md(data.text)))
  return layout('location', [
    h('h1', data.title),
    h('div.location-content', vdom(md(data.text)))
  ])
}
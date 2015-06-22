var h = require('virtual-dom/h')
var layout = require('./layout')
var vdom = require('vdom-virtualize').fromHTML
var md = require('marked')

module.exports = function (state) {
  return layout('location', state, [
    h('h1', state.item.title),
    h('div.location-content', {
      onclick: function (e) {
        if (e.target.tagName === 'A') {
          var external = require('../lib/external')(e.target.href)
          if (external) {
            e.preventDefault()
            window.open(e.target.href,'_blank');
          }
        }
      }
    }, vdom(md(state.item.text)))
  ])
}
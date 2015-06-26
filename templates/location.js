var h = require('virtual-dom/h')
var layout = require('./layout')
var vdom = require('virtual-html')
var md = require('marked')

module.exports = function (state) {
  var media = []

  if (state.item.audio) {
    media.push(vdom('<div>' + state.item.audio + '</div>'))
  }

  if (state.item.images.length) {
    state.item.images.forEach(function (image) {
      media.push(h('img', { src: image }))
    })
  }

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
    }, [
      media, 
      vdom(md('<div>' + state.item.text + '</div>')),
      h('p', [
        h('i', state.item.credit)
      ])
    ])
  ])
}
var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Content
inherits(Content, BaseElement)

function Content (el) {
  if (!(this instanceof Content)) return new Content(el)
  BaseElement.call(this, el)
  this.el = el
}

Content.prototype.render = function (template, state) {
  state = state || {}
  this.resize(state)
  var vtree = this.html('div.wrapper', template(state))
  return this.afterRender(vtree)
}

Content.prototype.resize = function (state) {
  this.el.style['height'] = state.height || 'initial'
  if (state.mobile) this.el.style['max-height'] = '70%'
  else this.el.style['max-height'] = '100%'
}

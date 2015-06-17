var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Location
inherits(Location, BaseElement)

function Location (el) {
  BaseElement.call(this, el)
}

Location.prototype.render = function (data) {
  var options = {}
  var vtree = this.html('div.location', options, template(data))
  return this.afterRender(vtree)
}

Location.prototype.template = function (data) {
  return this.html('wat')
}
var BaseElement = require('base-element')
var inherits = require('inherits')
var template = require('../templates/categories')

module.exports = Categories
inherits(Categories, BaseElement)

function Categories (el) {
  BaseElement.call(this, el)
}

Categories.prototype.render = function (data) {
  var options = {}
  var vtree = this.html('div.categories', options, template(data))
  return this.afterRender(vtree)
}
var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Content
inherits(Content, BaseElement)

function Content (el) {
  if (!(this instanceof Content)) return new Content(el)
  BaseElement.call(this, el)
  this.el = el
}

Content.prototype.render = function (template, options) {
  options = options || {}
  
  if (options.height) {
    this.el.style['height'] = options.height || 'initial'
    this.el.style['max-height'] = '75%'
  }
  
  else {
    this.el.style['max-height'] = '55%'
  }
    
  var vtree = this.html('div.wrapper', template)
  return this.afterRender(vtree)
}

Content.prototype.resize = function () {
  /*
  var content = document.querySelector('.modal-inner')
  content.style.width = (window.innerWidth - 44) + 'px'

  if (window.innerWidth < 470) {
    content.style.height = window.innerHeight - 152 + 'px'
  }
  else {
    content.style.height = window.innerHeight - 107 + 'px'
  }

  if (window.innerWidth > 800) {
    content.style.width = window.innerWidth / 2 + 'px'
    content.style.maxWidth = '500px'
  }
  */
}


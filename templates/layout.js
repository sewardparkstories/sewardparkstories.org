var h = require('virtual-dom/h')
var elClass = require('element-class')

module.exports = function (id, content) {
  return h('div#' + id, { className: 'page' }, [
    require('./actions')(),
    h('span.close', {
      onclick: function (e) {
        var i = e.target
        if (elClass(i).has('fa-chevron-down')) {
          elClass(i).remove('fa-chevron-down')
          elClass(i).add('fa-chevron-up')
        }
        
        else {
          elClass(i).remove('fa-chevron-up')
          elClass(i).add('fa-chevron-down')
        }
      }
    }, [h('i.fa.fa-chevron-down')]),
    h('div.scroller', content)
  ])
}
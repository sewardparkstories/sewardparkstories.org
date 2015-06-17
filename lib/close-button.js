var h = require('virtual-dom/h')
var elClass = require('element-class')

module.exports = function () {
  var container = document.getElementById('content')
  var oldHeight = container.style.maxHeight

  function hide (i) {
    var i = i || document.querySelector('i.toggle')
    elClass(i).remove('fa-chevron-down')
    elClass(i).add('fa-chevron-up')
    container.style.maxHeight = '50px'
  }

  function show (i) {
    var i = i || document.querySelector('i.toggle')
    elClass(i).remove('fa-chevron-up')
    elClass(i).add('fa-chevron-down')
    container.style.maxHeight = '75%'
  }

  function toggle (i) {
    var i = i || document.querySelector('i.toggle')
    if (elClass(i).has('fa-chevron-down')) hide(i)
    else show(i)
  }

  var vtree = h('span.close', {
    onclick: function (e) {
      toggle(e.target)
    }
  }, [h('i.toggle.fa.fa-chevron-down')])

  return {
    vtree: vtree,
    hide: hide,
    show: show,
    toggle: toggle
  }
}
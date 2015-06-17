var h = require('virtual-dom/h')
var elClass = require('element-class')

module.exports = function (state) {
  var container = document.getElementById('content')
  var oldHeight = container.style.maxHeight

  function hide (i, state) {
    var i = i || document.querySelector('i.toggle')
    elClass(i).remove('fa-chevron-down')
    elClass(i).add('fa-chevron-up')
    container.style.maxHeight = '50px'
  }

  function show (i, state) {
    var i = i || document.querySelector('i.toggle')
    elClass(i).remove('fa-chevron-up')
    elClass(i).add('fa-chevron-down')
    if (state.mobile) container.style.maxHeight = '75%'
    else container.style.maxHeight = '100%'
  }

  function toggle (i, state) {
    var i = i || document.querySelector('i.toggle')
    if (i.tagName === 'I') {
      if (elClass(i).has('fa-chevron-down')) hide(i, state)
      else show(i, state)
    }
  }

  var vtree = h('span.close', {
    onclick: function (e) {
      toggle(e.target, state)
    }
  }, [h('i.toggle.fa.fa-chevron-down')])

  return {
    vtree: vtree,
    hide: hide,
    show: show,
    toggle: toggle
  }
}
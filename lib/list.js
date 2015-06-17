var ViewList = require('view-list')
var extend = require('extend')

module.exports = function (opts) {
  var options = extend({
    className: 'location-list',
    eachrow: rows,
  }, opts)

  var list = ViewList(options)

  function rows (row) {

    function onclick (e) {
      document.querySelector('.scroller').scrollTop = 0
      list.send('click', e, row)
    }

    function onhover (e) {
      list.send('hover', e, row)
    }

    var rowOptions = { 
      onclick: onclick,
      onmouseover: onhover,
      href: '#' + row.properties.slug
    }

    return list.html('li.location', [
      list.html('a', rowOptions, row.properties.title)
    ])
  }

  return list
}
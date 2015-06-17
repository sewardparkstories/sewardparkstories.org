var ViewList = require('view-list')

module.exports = function (opts) {
  var options = extend({
    className: 'location-list',
    eachrow: rows,
  }, opts)

  var list = ViewList(options)

  function rows (row) {

    function onclick (e) {
      list.send('click', e, row)
    }

    function onhover (e) {
      list.send('hover', e, row)
    }

    var rowOptions = { 
      attributes: { 'data-key': row.key },
      onclick: onclick,
      onhover: onhover,
    }

    return h('li.location', rowOptions, row.title)
  }

  return list
}
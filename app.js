require('fastclick')(document.body)
var on = require('dom-event')

var flatsheet = require('flatsheet-api-client')({
  host: 'http://seward.flatsheet.io'
})

var templates = require('./templates/index')
var content = require('./lib/content')(document.getElementById('content'))
var state = require('./lib/state')(content)
var app = require('./lib/router')()

flatsheet.sheets.get('cc13b010-b0e1-11e4-a8bf-61e0a2f359a1', response)

function response (error, sheet) {
  if (error) app.go('/error')
  
  var locations = require('./lib/format-data')(sheet.rows)
  var find = require('./lib/find-data')(locations)
  state.locations = locations

  var map = require('./lib/map')(state, {
    el: 'map',
    attributionPosition: status.attribution,
    mapboxToken: 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw',
    tileLayer: 'sethvincent.de840f5b',
    onclick: function (e) {
      if (e.layer) app.go(e.layer.feature.properties.slug)
    }
  })

  var list = require('./lib/list')()
  list.addEventListener('click', function (e, item) {
    var layers = map.markerLayer._layers
    for (key in layers) {
      var layer = layers[key]
      var slug = layer.feature.properties.slug
      var page = e.target.href.split('#')[1]
      if (slug === page) {
        map.setActive(e, layer)
      }
    }
  })

  app.on('/', function () {
    content.render(templates.home, state)
  })

  app.on('/:slug', function (slug) {
    var item = find.bySlug(slug.slice(1))
    if (!item) return app.go('/error')
    state.item = item.properties
    content.render(templates.location, state)
  })

  app.on('/list', function () {
    state.list = list.render(locations)
    map.setGeoJSON(locations)
    content.render(templates.list, state)
  })

  app.on('/list/:category', function (path, params) {
    var locations = find.byCategory(params.category)
    state.list = list.render(locations)
    map.setGeoJSON(locations)
    content.render(templates.list, state)
  })

  app.on('/about', function () {
    content.render(templates.about, state)
  })

  app.on('/error', function () {
    content.render(templates.error, state)
  })

  app.start()
}

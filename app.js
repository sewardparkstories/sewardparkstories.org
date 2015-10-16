require('fastclick')(document.body)
var request = require('xhr')

var templates = require('./templates/index')
var content = require('./lib/content')(document.getElementById('content'))
var state = require('./lib/state')(content)
var app = require('./lib/router')()

request('/locations.json', response)

function response (error, res, body) {
  if (error) app.go('/error')
  console.log(error, body)
  var locations = require('./lib/format-data')(JSON.parse(body))
  var find = require('./lib/find-data')(locations)
  state.locations = locations

  var map = require('./lib/map')(state, {
    el: 'map',
    attributionPosition: state.attribution,
    mapboxToken: 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw',
    tileLayer: 'sethvincent.de840f5b',
    onclick: function (e) {
      if (e.layer) app.go(e.layer.feature.properties.slug)
    }
  })

  var list = require('./lib/list')()
  list.addEventListener('click', function (e, item) {
    var layers = map.markerLayer._layers
    for (var key in layers) {
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
    state.filteredLocations = null
    state.list = list.render(locations)
    map.setGeoJSON(locations)
    content.render(templates.list, state)
  })

  app.on('/list/:category', function (path, params) {
    var locations = state.filteredLocations = find.byCategory(params.category)
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

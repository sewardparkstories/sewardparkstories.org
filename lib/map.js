var L = require('leaflet')
L = require('mapbox.js')

var movement = require('geolocation-stream')()
var closeButton = require('./close-button')()

module.exports = function (state, options) {
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/'
  L.mapbox.accessToken = options.mapboxToken
  var tileLayer = L.mapbox.tileLayer(options.tileLayer)

  var map = L.map(options.el, {
    center: state.map.center,
    zoom: state.map.zoom,
    zoomControl: false,
    layers: [tileLayer],
    attributionControl: false
  })

  state.on('resize', function () {
    map.setZoom(state.map.zoom)
    map.setView(state.map.center)
  })

  var location = L.marker([47, -122], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'small',
      'marker-color': '#fa0'
    })
  }).addTo(map)

  movement.on('data', function (data) {
    location.setLatLng(new L.LatLng(data.coords.latitude, data.coords.longitude))
  })

  new L.Control.Zoom({ position: 'topright' }).addTo(map)

  function attributionPosition (position) {
    new L.control.attribution({ position: state.attribution })
      .setPrefix('')
      .addAttribution('<a href="https://www.mapbox.com/about/maps/">© Mapbox</a>')
      .addAttribution('<a href="https://www.openstreetmap.org/about">© OpenStreetMap</a>')
      .addAttribution('<a href="https://www.mapbox.com/map-feedback/">Improve this map</a>')
      .addTo(map)
  }

  var markerLayer = L.mapbox.featureLayer().addTo(map)
  markerLayer.setGeoJSON(state.locations)

  var clicked = false
  markerLayer.on('mouseover', function (e) {
    e.layer.openPopup()
    clicked = true
  })

  markerLayer.on('mouseout', function (e) {
    if (!clicked) e.layer.closePopup()
    clicked = false
  })

  markerLayer.on('click', function (e) {
    setActive(e, e.layer)
  })

  function setGeoJSON (locations) {
    markerLayer.setGeoJSON(locations)
  }

  function setActive (e, layer) {
    closeButton.show(null, state)
    resetColors()
    setColor(layer)
    layer.feature.zIndexOffset = 1000
    markerLayer.setGeoJSON(state.filteredLocations || state.locations)
    options.onclick(e)
  }

  function setColor (layer) {
    layer.feature.properties['old-color'] = layer.feature.properties['marker-color']
    layer.feature.properties['marker-color'] = '#ff8888'
  }

  function resetColors () {
    for (var i = 0; i < state.locations.length; i++) {
      var props = state.locations[i].properties
      props['marker-color'] = props['old-color'] || props['marker-color']
    }
  }

  return {
    map: map,
    setActive: setActive,
    setGeoJSON: setGeoJSON,
    markerLayer: markerLayer,
    attributionPosition: attributionPosition
  }
}

var L = require('leaflet')
require('mapbox.js')

module.exports = function map (data, options) {
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/'
  L.mapbox.accessToken = options.mapboxToken
  var tileLayer = L.mapbox.tileLayer(options.tileLayer)

  var map = L.map(options.el, {
    center: [47.54, -122.259555],
    zoom: 13,
    zoomControl: false,
    layers: [tileLayer]
  })

  new L.Control.Zoom({ position: 'topright' }).addTo(map)

  var markerLayer = L.mapbox.featureLayer().addTo(map)
  markerLayer.setGeoJSON(data)

  var clicked = false
  markerLayer.on('mouseover', function(e) {
    e.layer.openPopup()
    clicked = true
  })

  markerLayer.on('mouseout', function(e) {
    if (!clicked) e.layer.closePopup()
    clicked = false
  })

  markerLayer.on('click', function(e) {
    resetColors()
    setColor(e)
    markerLayer.setGeoJSON(data)
    options.onclick(e)
  })

  function setColor (e) {
    e.layer.feature.properties['old-color'] = e.layer.feature.properties['marker-color']
    e.layer.feature.properties['marker-color'] = '#ff8888'
  }

  function resetColors() {
    for (var i = 0; i < data.length; i++) {
      var props = data[i].properties
      props['marker-color'] = props['old-color'] || props['marker-color']
    }
  }

  return map
}
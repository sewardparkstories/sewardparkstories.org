var L = require('leaflet')
require('mapbox.js')

var closeButton = require('./close-button')()
console.log('wat', closeButton)

module.exports = function (data, options) {
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/'
  L.mapbox.accessToken = options.mapboxToken
  var tileLayer = L.mapbox.tileLayer(options.tileLayer)

  var map = L.map(options.el, {
    center: [47.54, -122.259555],
    zoom: 13,
    zoomControl: false,
    layers: [tileLayer],
    attributionControl: false
  })

  new L.Control.Zoom({ position: 'topright' }).addTo(map)
  new L.control.attribution({position: 'topleft'})
    .setPrefix('')
    .addAttribution('<a href="https://www.mapbox.com/about/maps/">© Mapbox</a>')
    .addAttribution('<a href="https://www.openstreetmap.org/about">© OpenStreetMap</a>')
    .addAttribution('<a href="https://www.mapbox.com/map-feedback/">Improve this map</a>')
    .addTo(map);

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
    closeButton.show()
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

  return {
    map: map,
    markerLayer: markerLayer
  }
}
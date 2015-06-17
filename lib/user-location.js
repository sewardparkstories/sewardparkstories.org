var movement = require('geolocation-stream')()

var location = L.marker([47, -122], {
  icon: L.mapbox.marker.icon({
    'marker-size': 'small',
    'marker-color': '#fa0'
  })
}).addTo(map)

movement.on('data', function(data) {
  location.setLatLng(new L.LatLng(data.coords.latitude, data.coords.longitude))
})

movement.on('error', function(err) {
  //console.error(err)
})
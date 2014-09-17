var fs = require('fs');
var Handlebars = require('handlebars');
var elClass = require('element-class');
var on = require('component-delegate').bind;
var movement = require('geolocation-stream')()
var Leaflet = require('leaflet');
require('mapbox.js');

var fastClick = require('fastclick');
fastClick(document.body);

L.mapbox.accessToken = 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw';

/* pull in template for showing info about a location */
//var template = Handlebars.compile(fs.readFileSync('info-template.html'));

/* set image path */
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* create map using mapbox plugin */
var map = L.mapbox.map('map', 'sethvincent.j0dohl2g');

movement.on('data', function(data) {
  console.log(data);
  L.mapbox.featureLayer({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        data.coords.longitude,
        data.coords.latitude
      ]
    },
    properties: {
      'marker-size': 'large',
      'marker-color': '#f4d123',
    }
  }).addTo(map);
});

movement.on('error', function(err) {
  console.error(err)
});

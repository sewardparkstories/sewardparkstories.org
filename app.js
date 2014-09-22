var fs = require('fs');
var Handlebars = require('handlebars');
var elClass = require('element-class');
var on = require('component-delegate').bind;
var movement = require('geolocation-stream')()
var Leaflet = require('leaflet');
require('mapbox.js');

var fastClick = require('fastclick');
fastClick(document.body);

var page = document.getElementById('page');
var mapEl = document.getElementById('map');
mapEl.style.height = (window.innerHeight - mapEl.offsetTop) + 'px';

var data = require('./data.json');

L.mapbox.accessToken = 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw';

/* pull in template for showing info about a location */
var template = Handlebars.compile(fs.readFileSync('info-template.html', 'utf8'));

/* set image path */
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* create map using mapbox plugin */
var satellite = L.mapbox.tileLayer('sethvincent.j0dohl2g');
var terrain = L.mapbox.tileLayer('sethvincent.jii2nijj');
var streets = L.mapbox.tileLayer('sethvincent.jii2ph3n');

var map = L.map('map', {
  center: [47.555, -122.252],
  zoom: 15,
  layers: [streets, terrain, satellite]
});


var baseMaps = {
  'streets': streets,
  'terrain': terrain,
  'satellite': satellite
};

// L.control.layers(baseMaps).addTo(map);

var location = L.marker([47, -122], {
  icon: L.mapbox.marker.icon({
    'marker-size': 'medium',
    'marker-color': '#fa0'
  })
}).addTo(map);

movement.on('data', function(data) {
  location.setLatLng(new L.LatLng(data.coords.latitude, data.coords.longitude));
});

movement.on('error', function(err) {
  console.error(err)
});

on(document.body, '.map-types a', 'click', function (e) {
  baseMaps[e.target.id].bringToFront();
});

data.forEach(addMarker);

/* add a marker to map from json data */
function addMarker (row, i) {
  var latlng = { lat: row['lat'], lng: row['long'] };
  var html = template(row);

  var marker = L.marker(latlng, {
    icon: L.mapbox.marker.icon({
      'marker-size': 'small',
      'marker-color': '#ff0000'
    })
  });

  marker.addTo(map);

  marker.on('click', function(e) {
    if (document.querySelector('.modal')) {
      page.removeChild(document.querySelector('.modal'));
    }

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = html;
    page.appendChild(modal);
    var inner = document.querySelector('.location-info');

    inner.style.width = (window.innerWidth - 95) + 'px';

    if (window.innerWidth < 700) {
      inner.style.height = window.innerHeight - 180 + 'px';
    }
    else {
      inner.style.height = window.innerHeight - 80 + 'px';
    }

    on(document.body, '#close-modal', 'click', function (e) {
      page.removeChild(modal);
      e.preventDefault();
    })
  });
}

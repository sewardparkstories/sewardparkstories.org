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
data = createImageArrays(data);

L.mapbox.accessToken = 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw';


/* 
* pull in template for showing info about a location
*/

var templates = {};

templates.info = Handlebars.compile(
  fs.readFileSync('info-template.html', 'utf8')
);

templates.list = Handlebars.compile(
  fs.readFileSync('list-template.html', 'utf8')
);


/* 
* set image path 
*/

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';


/* 
* create map using mapbox plugin 
*/

var streets = L.mapbox.tileLayer('sethvincent.de840f5b');

var map = L.map('map', {
  center: [47.555, -122.252],
  zoom: 15,
  layers: [streets]
});


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
  //console.error(err)
});

on(document.body, '.nav a', 'click', function (e) {
  var id = e.target.id;
  
  if (id === 'about-view') {
    var content = fs.readFileSync('about.html', 'utf8');
    modal(content);
  }
  
  else {
    var content = templates.list({ locations: data });
    modal(content);
  }
});

window.onresize = function (e) {
  var modal = document.querySelector('.modal');
  if (modal) resizeModal();
};

data.forEach(addMarker);


/* 
* add a marker to map from json data 
*/

function addMarker (row, i) {
  var latlng = { lat: row['lat'], lng: row['long'] };
  var content = templates.info(row);

  var marker = L.marker(latlng, {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': '#aa3c3c'
    })
  });

  marker.addTo(map);

  marker.on('click', function(e) {
    modal(content);
  });
}


function modal (content) {
  if (document.querySelector('.modal')) {
    page.removeChild(document.querySelector('.modal'));
  }
  
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = content;
  page.appendChild(modal);
  resizeModal();
}

on(document.body, '#close-modal', 'click', function (e) {
  var modal = document.querySelector('.modal');
  page.removeChild(modal);
  e.preventDefault();
});

function resizeModal () {
  var content = document.querySelector('.modal-inner');
  content.style.width = (window.innerWidth - 44) + 'px';

  if (window.innerWidth < 470) {
    content.style.height = window.innerHeight - 152 + 'px';
  }
  else {
    content.style.height = window.innerHeight - 107 + 'px';
  }
}

function createImageArrays (data) {
  data.forEach(function (item) {
    if (!item.photos) return;
    var images = item.photos.split(',');
    images.forEach(function(image, i) {
      if (!images[i].match('http')) {
        images.splice(i, 1);
      }
      else images[i] = images[i].replace(/ /g,'');
    });
    item.images = images;
  });
  
  return data;
}
var fs = require('fs');
var Handlebars = require('handlebars');
var elClass = require('element-class');
var on = require('component-delegate').bind;
var movement = require('geolocation-stream')();
var Scrollbar = require('scrollbar');
var Leaflet = require('leaflet');
require('mapbox.js');

var fastClick = require('fastclick');
fastClick(document.body);

var page = document.getElementById('page');
var mapEl = document.getElementById('map');
mapEl.style.height = (window.innerHeight - mapEl.offsetTop) + 'px';

var data = require('./data.json');
data = createImageArrays(data);
console.log('weeeeeeeee', data)

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
* categories
*/

var checkedCategories = [];
var menu = document.getElementById('menu');
categories = getAllCategories(data);
console.log(categories);
if (categories.length > 0) {
  menu.appendChild(document.createTextNode('Filter by category: '));
}
categories.forEach(function addCheckbox(item) {
  var checkbox = document.createElement('input');
  checkbox.className = 'categoryCheckbox';
  checkbox.type = 'checkbox';
  checkbox.name = item;
  checkbox.value = item;
  checkbox.addEventListener('change', updateWithFilters);
  
  var label = document.createElement('label');
  label.appendChild(document.createTextNode(item));
  
  menu.appendChild(checkbox);
  menu.appendChild(label);
})

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




/* 
* add a marker to map from json data 
*/

var markerGroup = new L.FeatureGroup();
data.forEach(addMarker);

updateWithFilters();

function addMarker (row, i) {
  var latlng = { lat: row['lat'], lng: row['long'] };
  var content = templates.info(row);
  
  var marker = L.marker(latlng, {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': '#aa3c3c'
    })
  });
  
  markerGroup.addLayer(marker);
  
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
    if (!item.image) return;
    var images = item.image.split(' ');
    images.forEach(function(image, i) {
      if (images[i].length > 0) {
        images[i] = images[i].replace(/ /g,'');
      }
    });
    item.images = images;
  });
  
  return data;
}

function updateWithFilters() {
  checkedCategories = [];
  var categoryCheckboxes = document.getElementsByClassName('categoryCheckbox');
  for (var i = 0; i < categoryCheckboxes.length; i++) {
    if (categoryCheckboxes[i].checked) {
      checkedCategories.push(categoryCheckboxes[i].value);
    }
  }
  console.log('checked:' + checkedCategories);
  markerGroup.clearLayers();
  map.removeLayer(markerGroup);
  if (checkedCategories.length > 0) {
    data.filter(filterByCategory).forEach(addMarker);
  } else {
    data.forEach(addMarker);
  }
  map.addLayer(markerGroup);
}

function filterByCategory(element) {
  console.log(element.category);
  console.log(checkedCategories);
  for (var i = 0; i < checkedCategories.length; i++) {
    if (checkedCategories[i] === element.category) {
      return true;
    }
  }
  return false;
}

function containsCategory(categories, c) {
  for (var i = 0; i < categories.length; i++) {
    if (categories[i] === c) return true;
  }
  return false;
}

function getAllCategories(data) {
  var categories = [];
  for (var i = 0; i < data.length; i++) {
    if (!containsCategory(categories, data[i].category)) {
      categories.push(data[i].category);
    }
  }
  return categories;
}
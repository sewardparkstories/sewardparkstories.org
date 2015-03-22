var fs = require('fs');
var page = require('page');
var Handlebars = require('handlebars');
var elClass = require('element-class');
var on = require('component-delegate').bind;
var movement = require('geolocation-stream')();
var Scrollbar = require('scrollbar');
var Leaflet = require('leaflet');
require('mapbox.js');

var flatsheet = require('flatsheet-api-client')({
  host: 'http://seward.flatsheet.io'
});

var fastClick = require('fastclick');
fastClick(document.body);

var main = document.getElementById('main');
var mapEl = document.getElementById('map');

flatsheet.sheet('cc13b010-b0e1-11e4-a8bf-61e0a2f359a1', function (err, sheet) {
  var data = createImageArrays(sheet.rows);

  var dataByID = {};
  for (var i = 0, l = data.length; i < l; i++) {
    data[i].id = slugify(data[i].title);
    dataByID[data[i].id] = data[i];
  }

  L.mapbox.accessToken = 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw';


  /* 
  * pull in templates. requires browserify with brfs as build step
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
  var menu = document.getElementById('filter');
  categories = getAllCategories(data);

  categories.forEach(function addCheckbox(item) {
    var div = document.createElement('div');
    elClass(div).add('filter-option');
    
    var checkbox = document.createElement('input');
    checkbox.className = 'categoryCheckbox';
    checkbox.type = 'checkbox';
    checkbox.name = item;
    checkbox.value = item;
    checkbox.checked = true;
    checkbox.addEventListener('change', updateWithFilters);
    
    var label = document.createElement('label');
    label.appendChild(document.createTextNode(item));
    label.htmlFor = item;
    
    div.appendChild(checkbox);
    div.appendChild(label);
    menu.appendChild(div);
  })


  /* 
  * create map using mapbox plugin 
  */

  var streets = L.mapbox.tileLayer('sethvincent.de840f5b');

  var map = L.map('map', {
    center: [47.551398, -122.259555],
    zoom: 14,
    zoomControl: false,
    layers: [streets]
  });

  new L.Control.Zoom({ position: 'topright' }).addTo(map);


  var location = L.marker([47, -122], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'small',
      'marker-color': '#fa0'
    })
  }).addTo(map);

  movement.on('data', function(data) {
    location.setLatLng(new L.LatLng(data.coords.latitude, data.coords.longitude));
  });

  movement.on('error', function(err) {
    //console.error(err)
  });

  var baseurl = '/';

  page.base(baseurl+'/#')

  page('/', function () {
    page('/about');
  });

  page('/about', function (ctx) {
    var content = fs.readFileSync('about.html', 'utf8');
    modal(content);
  });

  page('/list', function (ctx) {
    var content = templates.list({ locations: data });
    modal(content);
  });

  page(baseurl, '/');

  page('/:id', function (ctx) {
    var row = dataByID[ctx.params.id];
    console.log(row);
    var content = templates.info(row);
    modal(content);
  });

  page();


  on(document.body, 'a', 'click', function (e) {
    if (elClass(e.target).has('ignore')) return;
    var dest = e.target.hash.substring(1, e.target.hash.length);
    page(dest);
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
    
    var marker = L.marker(latlng, {
      icon: L.mapbox.marker.icon({
        'marker-size': 'small',
        'marker-line-color': '#335966',
        'marker-line-opacity': 1,
        'marker-color': '#335966'
      })
    });
      
    markerGroup.addLayer(marker);
    
    marker.on('click', function(e) {
      page('/'+row.id);
    });
  }


  function modal (content) {
    if (document.querySelector('.modal')) {
      main.removeChild(document.querySelector('.modal'));
    }

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;
    main.appendChild(modal);
    resizeModal();
  }

  on(document.body, '#close-modal', 'click', function (e) {
    var modal = document.querySelector('.modal');
    main.removeChild(modal);
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

    if (window.innerWidth > 800) {
      content.style.width = window.innerWidth / 2 + 'px';
      content.style.maxWidth = '500px';
      //if (map.getZoom() < 16) map.panTo([47.55653, -122.26434]);
    }
  }

  function createImageArrays (data) {
    data.forEach(function (item) {
      if (!item['image_1']) return;
      var images = [item['image_1'], item['image_2']];
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

});

function slugify (title) {
  return title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
}
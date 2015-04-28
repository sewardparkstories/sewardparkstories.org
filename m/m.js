var fs = require('fs');
var Handlebars = require('handlebars');
require('leaflet');
require('mapbox.js');
var flatsheet = require('flatsheet-api-client')({
  host: 'http://seward.flatsheet.io'
});

var SewardMap = (function(){
  var map;
  var markerGroup;
  var activeMarker;
  var stories;
  var templates = {};
  var currentLocation;

  templates.info = Handlebars.compile(
    fs.readFileSync('m/popup-template.html', 'utf8')
  );

  function init(){
    map = L.map('map', {
      center: [47.551398, -122.259555],
      zoom: 14,
      zoomControl: false,
    });

    L.mapbox.accessToken = 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw';
    L.mapbox.tileLayer('sethvincent.de840f5b').addTo(map);
    L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images/';
  }

  function moveActiveMarker(latLng){
    if(activeMarker === undefined){
      activeMarker = L.marker(L.latLng(latLng), {
        icon: L.mapbox.marker.icon({
          'marker-size': 'small',
          'marker-line-color': '#335966',
          'marker-line-opacity': 1,
          'marker-color': '#f00',
          'zIndexOffset': 99,
        })
      });
      markerGroup.addLayer(activeMarker);
    } else {
      activeMarker.setLatLng(latLng);
    }
    activeMarker.update();
  }

  function storyPopup(story){
    var content = templates.info(story);
    var maxWidth = 300;
    var maxHeight = 300;
    var sizeFactor = 0.75;
    if (map.getSize().x < 300) {
      maxWidth = map.getSize().x * sizeFactor;
      maxHeight = map.getSize().y * sizeFactor;
    }
    var options = {
      maxWidth: maxWidth,
      maxHeight: maxHeight,
    };

    var popup = L.popup(options).setContent(content);
    
    return popup;
  }

  function addMarker (story, i) {
    var latlng = { lat: story['lat'], lng: story['long'] };
    var marker = L.marker(latlng, {
      icon: L.mapbox.marker.icon({
        'marker-size': 'small',
        'marker-line-color': '#335966',
        'marker-line-opacity': 1,
        'marker-color': '#335966',
      })
    }).bindPopup(storyPopup(story));
      
    markerGroup.addLayer(marker);
    
    marker.on('click', function(e) {
      var latLng = this.getLatLng();
      map.panTo(latLng);
      var south = map.getBounds().getSouth();
      latLng = L.latLng((latLng.lat + (latLng.lat - south) * 0.75), latLng.lng);
      map.panTo(latLng);

      this.openPopup().update();
      // window.location.hash = '/' + story.id;
      moveActiveMarker(this.getLatLng());
    });
  }

  function getStories(){
    flatsheet.sheets.get('cc13b010-b0e1-11e4-a8bf-61e0a2f359a1', function (err, sheet) {
      var data = createImageArrays(sheet.rows);

      var dataByID = {};
      for (var i = 0, l = data.length; i < l; i++) {
        data[i].id = slugify(data[i].title);
        dataByID[data[i].id] = data[i];
      }
      stories = data;
      markerGroup = new L.FeatureGroup();  
      stories.forEach(addMarker);
      map.addLayer(markerGroup);
    });

    function createImageArrays (data) {
      data.forEach(function (item) {
        if (!item['image_1']) return;
        var images = [];
        if (item['image_1'].length > 1) images[0] = item['image_1'];
        if (item['image_2'].length > 1) images[1] = item['image_2'];
        item.images = images;
      });
      return data;
    }

    function slugify (title) {
      return title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  };


  var create = function(){
    init();
    getStories();
  };

  return {
    create: create,
  };
})();


SewardMap.create();


var arrayFilter = require('array-filter')
var cuid = require('cuid')
var slugify = require('./slugify')

module.exports = function (data) {
  var geojson = []
  var l = data.length
  var i = 0

  for (i; i<data.length; i++) {
    var item = data[i]
    var published = !(item.published == null || item.published === 'false')
    if (published && item.lat && item.long) {
      item = createSlug(item)
      item = createImageArrays(item)

      var point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(item.long), Number(item.lat)]
        },
        properties: item
      }

      point.properties['marker-size'] = 'medium'
      point.properties['marker-line-color'] = '#004990'
      point.properties['marker-line-opacity'] = 1
      point.properties['marker-color'] = '#004990';

      geojson.push(point)
    }
  }
  return geojson
}

function createSlug (item) {
  item.slug = item.title? slugify(item.title) : cuid()
  return item
}

function createImageArrays (item) {
  var images = item.images = []
  if (!item['image_1']) return item
  if (item['image_1'].length > 1) images[0] = item['image_1']
  if (item['image_2'] && item['image_2'].length > 1) images[1] = item['image_2']
  return item
}
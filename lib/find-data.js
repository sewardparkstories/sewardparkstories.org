var arrayFilter = require('array-filter')

module.exports = function (data) {
  var find = {}

  find.bySlug = function bySlug (slug) {
    return arrayFilter(data, function (item, i, arr) {
      return slug === item.properties.slug
    })[0]
  }

  find.byCategory = function byCategory (category) {
    return arrayFilter(data, function (item, i, arr) {
      console.log(category, item.properties.category, category === item.properties.category)
      return category === item.properties.category
    })
  }

  find.nearby = function nearby (latlng, data) {
    // use turf-buffer & turf-within
    // return array
  }

  return find
} 
var test = require('tape')
var each = require('each-async')
var isarray = require('isarray')
var format = require('../lib/format-data')

var data = require('./data.json')

test('format data', function (t) {
  data = format(data.rows)
  each(data, function (item, i, done) {
    t.equals(isarray(item.images), true)
    t.ok(item.slug)
    done()
  }, function () { t.end() })
})

test('find data by slug', function (t) {
  var find = require('../lib/find-data')(data)
  var item = find.bySlug('in-shallow-water')
  t.ok(item)
  t.equals(item.slug, 'in-shallow-water')
  t.end()
})

test('find data by category', function (t) {
  var find = require('../lib/find-data')(data)
  var list = find.byCategory('ecology')
  t.ok(list)
  t.equals(list.length, 13)
  t.end()
})

require('fastclick')(document.body)

var flatsheet = require('flatsheet-api-client')({
  host: 'http://seward.flatsheet.io'
})

var templates = require('./templates/index')

var app = require('./lib/router')()
var content = require('./lib/content')(document.getElementById('content'))
flatsheet.sheets.get('cc13b010-b0e1-11e4-a8bf-61e0a2f359a1', response)

function response (error, sheet) {
  if (error) router.go('/error')
  var data = require('./lib/format-data')(sheet.rows)
  var find = require('./lib/find-data')(data)

  var map = require('./lib/map')(data, {
    el: 'map',
    mapboxToken: 'pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw',
    tileLayer: 'sethvincent.de840f5b',
    onclick: function (e) {
      app.go(e.layer.feature.properties.slug)
    }
  })

  app.on('/', function () {
    content.render(templates.home())
  })

  app.on('/:slug', function (slug) {
    var item = find.bySlug(slug.slice(1))
    content.render(templates.location(item.properties), { height: '70%' })
  })

  app.on('/list', function (ctx) {
    content.render(templates.list(), { height: '70%' })
  })

  app.on('/about', function () {
    content.render(templates.about(), { height: '70%' })
  })

  app.on('/error', function () {
    content.render(templates.error())
  })

  app.start()
}



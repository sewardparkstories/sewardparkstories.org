var h = require('virtual-dom/h')

module.exports = function (data) {
  return h('div#home', [
    h('img.logo', { src: 'assets/logo.png' }),
    require('./actions')(),
    h('div.welcome', 'Welcome to the stories of Southeast Seattle’s Seward Park, home to the city’s last old-growth forest.')
  ])
}
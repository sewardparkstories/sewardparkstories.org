var h = require('virtual-dom/h')

module.exports = function (state) {
  return h('div#home', [
    h('img.logo', { src: 'assets/logo.png' }),
    require('./actions')(null, state),
    h('div.welcome', 'Welcome to the stories of Southeast Seattle’s Seward Park, home to the city’s last old-growth forest.')
  ])
}
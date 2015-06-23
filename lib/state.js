var emitter = require('component-emitter')
var state = {}

module.exports = function setState (content) {
  state = {
    height: '70%',
    windowWidth: window.innerWidth,
    attribution: 'topleft',
    mobile: true,
    map: {
      center: [47.53853, -122.25672],
      zoom: 13
    }
  }

  if (state.windowWidth > 800) {
    state.height = '100%'
    state.attribution = 'bottomright'
    state.mobile = false
    state.map.center = [47.55353, -122.29534]
    state.map.zoom = 14
  }

  emitter(state)
  window.onresize = function (e) {
    state.emit('resize', state)
    state = setState(content)
  }

  content.resize(state)
  return state
}

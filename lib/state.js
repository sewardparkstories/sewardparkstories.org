module.exports = function setState (content) {
  var status = {
    height: '70%',
    windowWidth: window.innerWidth,
    attribution: 'topleft',
    mobile: true
  }

  if (status.windowWidth > 800) {
    status.height = '100%'
    status.attribution = 'bottomright'
    status.mobile = false
  }

  window.onresize = function (e) {
    status = setState(content)
  }

  content.resize(status)
  return status
}

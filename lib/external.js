module.exports = external

function check (url) {
  if (url.indexOf('//') === 0) { url = location.protocol + url }
  return url.toLowerCase().replace(/([a-z])?:\/\//,'$1').split('/')[0]
}

function external (url) {
  return ((url.indexOf(':') > -1 || url.indexOf('//') > -1) && check(location.href) !== check(url))
}
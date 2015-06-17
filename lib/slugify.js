module.exports = function slugify (title) {
  return title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
}
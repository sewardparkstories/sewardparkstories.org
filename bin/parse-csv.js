var fs = require('fs');
var csv = require('csv-parser')

var out = [];

fs.createReadStream(__dirname + '/../data.csv')
  .pipe(csv())
  .on('data', function (data) {
    data.id = slugify(data.title);
    out.push(data);
  })
  .on('end', function () {
    fs.writeFile(__dirname + '/../data.json', JSON.stringify(out), function (err) {
      if (err) return console.log(err);
      console.log('data.json file updated');
    });
  });


function slugify (title) {
  return title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
}
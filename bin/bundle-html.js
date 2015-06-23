#!/usr/bin/env node

var fs = require('fs')
var convert = require('html2hyperscript')

var fileName = process.argv[2]
if (!fileName) throw new Error('supply input HTML file as first argument')

var text = 'var h = require("virtual-dom/h")\n\n'
text += 'module.exports = [' 
text += convert(fs.readFileSync(fileName))

process.stdout.write(text)
process.stdout.write("]\n")
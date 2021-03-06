#!/usr/bin/env node

/**
 * Module dependencies.
 */
function isDefined(x) { return x !== null && x !== undefined }
Array.prototype.contain = function (obj) {
	return this.indexOf(obj) !== -1
}

var program = require('commander')
var version = require("../package.json").version

program
	.version(version)
	.usage(" a node npm wrapper of yichen_toc https://github.com/yichenshanren/tocmd.npm ")
	.option('-f, --file [filename]', ' default is README.md ')
	.option('-s, --highlight [stylename]', ' default is googlecode.css ')
	.option('-o, --open', 'open in browser')
	.option('-v, --verbose', '打印详细日志')
	.parse(process.argv)

var pwd = process.cwd()
var filename = "README.md"
var stylename = "googlecode.css"
var is_open = false

if (program.file) {
	filename = program.file
}

if (program.highlight) {
	stylename = program.highlight
}

if (program.open) {
	is_open = program.open
}

var verbose = false
if (program.verbose) {
	verbose = program.verbose
}

var _verbose = verbose
function log(str) {
	if (_verbose == true) {
		console.log(str)
	}
}

log('filename = ' + filename)
log('verbose = ' + verbose)
log('stylename = ' + stylename)
var source_file = filename

var markd_config = {
	debug: false
}

var source_file_name = pwd + '/' + source_file
var file_name = source_file_name.split('/').pop()
var _file_name = file_name.split('.')[0]

if (file_name.indexOf('\\') > 0) {
	_file_name = file_name.substring(file_name.lastIndexOf("\\")).split('.')[0]
}
var dest_file_path = pwd + '/preview/' + _file_name + '.html'

console.log('pwd=' + pwd)
console.log('source_file_name=' + source_file_name)
console.log('dest_file_path=' + dest_file_path)

require('../index')(pwd, source_file_name, dest_file_path, is_open, markd_config, stylename)

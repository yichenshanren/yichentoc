'use strict'

require('shelljs/global')

var hljs  =  require('highlight.js')
var assign = require('object-assign')
var fs = require('fs')
var BufferHelper = require('bufferhelper')
var Handlebars = require('handlebars')
var open = require("open")

function generator(pwd, source_file_name, dest_file_path, is_open, options, stylename) {
	var file_name = source_file_name.split('/').pop()
	var _file_name = file_name.split('.')[0]

	var is_debug = options.debug
	function log(str) {
		if (is_debug == true)
			console.log(str)
	}

	// 点号表示当前文件所在路径  
	var str = fs.realpathSync('.')
	log(str)
	log(stylename)

	//函数可以返回当前正在执行的项目路径
	var pwd = pwd
	//:属性返回的是  nodejs 的安装路径 
	// processor.execPath 

	var preview_path = pwd + '/preview'

	var source_file_path = source_file_name

	var dest_file_path = dest_file_path

	if (test('-d', preview_path)) {
		/* do something with dir */
		mkdir('-p', preview_path)
	}

	cp_template_dir(__dirname, preview_path)
	_toc_config(__dirname, preview_path)

	function cp_template_dir(_cur_dir, _dest_dir) {
		var i = _cur_dir
		log(i)
		rm('-rf', _cur_dir + '/vendor/toc/css/highlight.css')
		cp('-f', _cur_dir + '/vendor/highlight/styles/' + stylename, _cur_dir + '/vendor/toc/css/highlight.css')
		cp('-Rf', _cur_dir + '/vendor/toc', _dest_dir + '/')
	}

	function _toc_config(_cur_dir, _dest_dir) {
		if (test('-d', _dest_dir + "/toc_conf.js")) {
			log('toc_conf file exist')
		} else {
			cp('-R', _cur_dir + '/vendor/toc_conf.js', _dest_dir + '/')
		}
	}

	var template_path = __dirname + '/vendor/template.html'
	log('template_path = ' + template_path)

	fs.readFile(source_file_path, function (err, data) {
		if (err) throw err
		log(data)

		// var rs = fs.createReadStream(template_path, {encoding: 'utf-8', bufferSize: 11})
		var rs = fs.createReadStream(template_path, { bufferSize: 11 })
		var bufferHelper = new BufferHelper()

		rs.on("data", function (trunk) {
			bufferHelper.concat(trunk)
		})

		rs.on("end", function () {
			var source = bufferHelper.toBuffer().toString('utf8')
			var template = Handlebars.compile(source)

			log(template)

			var marked = require('marked')
			// highlight.js的同步高亮
			marked.setOptions({
				highlight: function(code) {
					return hljs.highlightAuto(code).value;
				}
			});
			// marked = require('gulp-markdown-livereload')
			marked(data.toString(), options, function (err, data) {
				if (err) {
					log('err ' + err)
					return
				}
				log(data)

				var css_link = "ddsds"
				var data1 = {
					"title": _file_name,
					"parse_markdown": data
				}

				var final_html_content = new Buffer(template(data1))

				log(dest_file_path)

				if (options.index === true) {
					dest_file_path = dest_file_path.replace('README', 'index')
				}

				log(dest_file_path)

				fs.writeFile(dest_file_path, final_html_content, function (err) {
					if (err) throw err
					log('It\'s saved!')

					if (is_open == true) {
						open(dest_file_path)
					}
				})
			})
		})
	})
}


// generator('sample.md')

module.exports = generator
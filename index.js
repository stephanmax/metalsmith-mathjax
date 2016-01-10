var mjAPI = require("./node_modules/mathjax-node/lib/mj-page.js");
var jsdom = require("jsdom").jsdom;
var debug = require('debug')('metalsmith-mathjax');
var each = require('async').each;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to hide drafts from the output.
 *
 * @return {Function}
 */

function plugin(opts){
  return function(files, metalsmith, done) {
    each(Object.keys(files), prerender, done);

    function prerender(file, done) {
		var data = files[file];
		if (!data.mathjax) return done();
		debug("Found mathjax in", file);
		var document = jsdom(data.contents.toString());
		mjAPI.start();

		mjAPI.typeset({
		  html: document.body.innerHTML,
		  renderer: "SVG",
		  inputs: ["TeX"]
		}, function(result) {
		  document.body.innerHTML = result.html;
		  var HTML = "<!DOCTYPE html>\n" + document.documentElement.outerHTML.replace(/^(\n|\s)*/, "");
		  data.contents = new Buffer(HTML);
	      debug('Prerendered MathJAX for file: %s', file);
		  done();
		});			
    }
  };
}
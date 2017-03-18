var mjAPI = require("mathjax-node-page");
//var mjAPI = require("mathjax-node");
var jsdom = require("jsdom");
var debug = require('debug')('metalsmith-mathjax');
var async = require('async');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to hide drafts from the output.
 *
 * @return {Function}
 */

function plugin(opts) {
    return function(files, metalsmith, done) {
        async.eachSeries(Object.keys(files), prerender, done);

        function prerender(file, done) {
            var data = files[file];
            if (!data.mathjax) {
                done();
            } else {
                debug("Found mathjax in", file);
                var contents = data.contents.toString('utf8');

                mjAPI.mjpage(contents, {format: ["TeX"]}, {svg: true}, function(result) {
                    // window.document.body.innerHTML = result.html;
                    // var HTML = "<!DOCTYPE html>\n" + window.document.documentElement.outerHTML.replace(/^(\n|\s)*/, "");
                    data.contents = new Buffer(result);
                    debug('Prerendered MathJAX for file: %s', file);
                    done();
                });
            }
        };
    };
}

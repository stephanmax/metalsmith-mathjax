var mjAPI = require("./node_modules/mathjax-node/lib/mj-page.js");
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

                jsdom.env({
                    html: contents,
                    scripts: ["https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"],
                    done: function(err, window) {
                        if (err) {
                        	console.log("We have an error");
                            throw(err);
                        }
                        window.document.$ = window.$;
                        mjAPI.start();

                        mjAPI.typeset({
                            html: window.document.body.innerHTML,
                            renderer: "SVG",
                            inputs: ["TeX"]
                        }, function(result) {
                            window.document.body.innerHTML = result.html;
                            var HTML = "<!DOCTYPE html>\n" + window.document.documentElement.outerHTML.replace(/^(\n|\s)*/, "");
                            data.contents = new Buffer(HTML);
                            debug('Prerendered MathJAX for file: %s', file);
                            done();
                        });
                    }
                });
            }
        };
    };
}

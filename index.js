const mjAPI = require("mathjax-node/lib/mj-page.js");
const jsdom = require("jsdom");
const debug = require('debug')('metalsmith-mathjax');
const async = require('async');

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

                    mjAPI.mjpage(contents, { format: ["TeX"] }, { svg: true }, function(result) {
                            // window.document.body.innerHTML = result.html;
                            // var HTML = "<!DOCTYPE html>\n" + window.document.documentElement.outerHTML.replace(/^(\n|\s)*/, "");
                            data.contents = new Buffer(result);
                            debug('Prerendered MathJAX for file: %s', file);
                            done();

                            jsdom.env({
                                html: contents,
                                done: function(err, window) {
                                    if (err) {
                                        console.log("We have an error");
                                        throw (err);
                                    }
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
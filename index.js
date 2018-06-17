var mjAPI = require("mathjax-node-page");
var defaults = require("lodash").defaults;
var debug = require('debug')('metalsmith-mathjax');
var async = require('async');

module.exports = plugin;

function plugin(options = {}) {
    defaults(options, {
        mjpageConfig: {format: ["TeX"]},
        mjnodeConfig: {svg: true}
    })
    return function(files, metalsmith, done) {
        async.eachSeries(Object.keys(files), prerender, done);

        function prerender(file, done) {
            var data = files[file];
            if (!data.mathjax) {
                done();
            } else {
                debug("Found math notation in", file);
                var contents = data.contents.toString('utf8');

                mjAPI.mjpage(contents, options.mjpageConfig, options.mjnodeConfig, function(result) {
                    data.contents = new Buffer(result);
                    debug('Prerendered math for file: %s', file);
                    done();
                });
            }
        };
    };
}

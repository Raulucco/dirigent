'use strict';
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var args = process.argv.slice(2);
var DEFAULT_CONFIG_FILE_NAME = require('./files.js').scripts;
var configFile;
var customConfigFile = path.join(process.cwd(), args[0] || DEFAULT_CONFIG_FILE_NAME);

fs.exists(customConfigFile, function (exists) {
    if (exists) {
        configFile = require(customConfigFile);
    } else {
        configFile = require('./' + DEFAULT_CONFIG_FILE_NAME);
    }
    run();
});

function run () {
    var compiler = webpack(configFile);

    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        }
    });
}

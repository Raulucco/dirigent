#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var webpack = require('webpack');
var args = process.argv.slice(2);
var DEFAULT_CONFIG_FILE_NAME = require('./conf/dirigentfile.js').scripts;
var configFile;
var env = args[2];
var customConfigFile = path.join(process.env.modulePath, args[0] + '.webpack.config.js');
var defaultOpts = require('./conf/webpack.config.js');

fs.exists(customConfigFile, function (exists) {
    if (exists) {
        configFile = require(customConfigFile);
        for (var key in defaultOpts[env]) {
            if (defaultOpts[env].hasOwnProperty(key) && !configFile.hasOwnProperty(key)) {
                configFile[key] = defaultOpts[env][key];
            }
        }

    } else {
        configFile = defaultOpts[env];
    }

    var options = env === 'dev' ? { recursive: true, persistent: true } : null;

    if (options) {
        fs.watch(process.cwd(), options, function (event, filename) {
            run();
            var child = child_process.exec('npm test');
            process.stdout.write(filename + ': changed');
            child.stderr.pipe(process.stderr);
            child.stdout.pipe(process.stdout);
            //console.log();
        });
    }

    run();
});

function run() {
    var compiler = webpack(configFile);

    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log(stats.toString());
        }
    });


}

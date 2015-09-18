#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var child_process = require('child_process');
var webpack = require('webpack');
var args = process.argv.slice(2);
var DEFAULT_CONFIG_FILE_NAME = require('./conf/dirigentfile.js').scripts;
var configFile;
var env = args[4] || 'dev';
var customConfigFile = path.join(process.env.modulePath, args[0] + '.webpack.config.js');
var defaultOpts = require('./conf/webpack.config.js');

util.log('Start scripts building on => ' + process.cwd());

fs.access(customConfigFile, fs.R_OK, function (error) {
    if (!error) {
        configFile = require(customConfigFile);
        for (var key in defaultOpts[env]) {
            if (defaultOpts[env].hasOwnProperty(key) && !configFile.hasOwnProperty(key)) {
                configFile[key] = defaultOpts[env][key];
            }
        }

    } else {
        process.stdout.write('\n');
        process.stderr.write(error.message);
        process.stdout.write('\n');
        util.log('Switch default configuration ... \n ' + env + '\n' + JSON.stringify(defaultOpts[env], null, 2));
        process.stdout.write('\n');
        configFile = defaultOpts[env];
    }

    var options = env === 'dev' ? { recursive: true, persistent: true } : null;

    if (options) {
        fs.watch(process.cwd(), options, function (event, filename) {
            run();
            var child = child_process.exec('npm test');
            process.stdout.write('\n');
            process.stdout.write(filename + ': changed');
            process.stdout.write('\n');
            child.stderr.pipe(process.stderr);
            child.stdout.pipe(process.stdout);
        });
    }

    run();
});

function run() {
    console.log(configFile, process.env);

    if (!configFile) {
        process.abort();
    }

    var compiler = webpack(configFile);

    process.stdout.write('\n');
    //util.log(JSON.stringify(configFile, null, 2));
    process.stdout.write('\n');
    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log(stats.toString());
        }
    });


}

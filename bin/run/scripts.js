#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var child_process = require('child_process');
var webpack = require('webpack');
var logger = require('../logUtils.js');
var args = process.argv.slice(2);
var DEFAULT_CONFIG_FILE_NAME = require('./conf/dirigentfile.js').scripts;
var configFile;
var env = args[4] || 'dev';
var customConfigFile = path.join(process.cwd(), args[0] + '.webpack.config.js');
var defaultOpts = require('./conf/webpack.config.js');

util.log('Starting scripts building on => ' + process.cwd() + '\n');

fs.access(customConfigFile, fs.R_OK, function (error) {
    if (!error) {
        configFile = require(customConfigFile);
        for (var key in defaultOpts[env]) {
            if (defaultOpts[env].hasOwnProperty(key) && !configFile.hasOwnProperty(key)) {
                configFile[key] = defaultOpts[env][key];
            }
        }

    } else {
        logger.logErrorMessage(error);
        util.log('Switch default configuration ... \n ' + env + '\n' + JSON.stringify(defaultOpts[env], null, 2));
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
            child.on('error', function (event) {
                logger.logObject(event, 'Event ' + child.pid);
                child.exit(1);
            });
        });
    } else {
        run();
    }
});

function run() {
    if (!configFile) {
        process.abort();
    }

    var compiler = webpack(configFile);
    logger.logObject(configFile, 'Webpack config ' + process.pid);
    compiler.run(function (err, stats) {
        if (err) {
            logger.logErrorMessage(err);
        } else {
            logger.logObject(stats, 'Webpack stats')
        }
    });


}

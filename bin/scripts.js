#!/usr/bin/env node

'use strict';
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var args = process.argv.slice(2);
var DEFAULT_CONFIG_FILE_NAME = require('./dirigentfile.js').scripts;
var configFile;
var env = args[2];
var customConfigFile = path.join(process.cwd(), args[3] || env + '.' + DEFAULT_CONFIG_FILE_NAME);
var defaultOpt = {
    dev: {
        devtool: 'source-map',
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
        },
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader' }
            ]
        }
    },

    deploy: {
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ],
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader' }
            ]
        }
    }
};
console.log(customConfigFile);
fs.exists(customConfigFile, function (exists) {
    if (exists) {
        configFile = require(customConfigFile);
    } else {
        configFile = require('./' + DEFAULT_CONFIG_FILE_NAME);
    }

    for (var key in defaultOpt[env]) {
        if (defaultOpt.hasOwnProperty(key) && !configFile.hasOwnProperty(key)) {
            configFile[key] = defaultOpt[env][key];
        }
    }

    run();
});

function run() {
    var compiler = webpack(configFile);
    console.log(configFile);
    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log(stats);
        }
    });
}

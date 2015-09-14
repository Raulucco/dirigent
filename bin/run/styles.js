'use strict';
var fs = require('fs');
var path = require('path');
var Q = require('q');
var args = process.argv.slice(1);
var DEFAULT_CONFIG_FILE_NAME = require('./dirigentfile.js').styles;
var sass = require('node-sass');
var configFile;
var env = args[0];
var customConfigFile = path.join(process.cwd(), args[1] || DEFAULT_CONFIG_FILE_NAME);

fs.exists(customConfigFile, function (exists) {
    if (exists) {
        configFile = require(customConfigFile);
    } else {
        configFile = require('./' + DEFAULT_CONFIG_FILE_NAME);
    }

    run();
});

function run() {
    sass.render(configFile, function (err, result) {
        if (err) {
            notifyError(err);
            return;
        }
        writeOutputFile(result);

    });
}

function notifyError(err) {

}

function writeOutputFile(result) {
    var cssFileDefer = Q.defer();
    var mapFileDefer = Q.defer();
    Q.ncall(fs.writeFile(result.css)).then(function (result) {
        cssFileDefer.resolve(result);
    }, function (err) {
        cssFileDefer.reject(err);
    });

    Q.ncall(fs.writeFile(result.map)).then(function (result) {
        mapFileDefer.resolve(resolve);
    }, function (err) {
        mapFileDefer.reject(err);
    });

    Q.all([cssFileDefer.promise, mapFileDefer.promise]).then(function () {
        console.log('Hurra');
    });
}
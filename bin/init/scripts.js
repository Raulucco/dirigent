#!/usr/bin/env node

'use strict';

var Q = require('q');
var inquirer = require('inquirer');
var choices = ["Yes", "No"];
var createScriptsConfFile = require('./scripts/createConfigFiles.js');
var ioOptions = require('./IO-options.js');
var defer = Q.defer();

var scripts = {
    name: 'scripts',
    message: 'Would you like dirigent to build your scripts?',
    type: 'list',
    default: 0,
    choices: choices
};

module.exports = function init() {
    process.stdout.write('\nScripts\n');
    inquirer.prompt(scripts, function (answer) {
        if (answer.scripts === choices[0]) {
            Q.when(createScriptsConfFile(ioOptions))
                .then(function (result) {
                    defer.resolve(result);
                }, function (error) {
                    defer.reject(error);
                });
        } else {
            defer.reject(choices[1]);
        }
    });

    return defer.promise;
}
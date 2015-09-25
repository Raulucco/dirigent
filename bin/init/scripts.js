#!/usr/bin/env node

'use strict';

var Q = require('q');
var inquirer = require('inquirer');
var choices = ["Yes", "No"];
var createScriptsConfFile = require('./createConfigFiles.js');
var ioOptions = require('./IO-options.js');
var defer = Q.defer();

var question = {
    name: 'scripts',
    message: 'Would you like dirigent to build your scripts?',
    type: 'list',
    default: 0,
    choices: choices
};

function init() {
    process.stdout.write('\nScripts\n');
    inquirer.prompt(question, function (answer) {
        if (answer.scripts === choices[0]) {
           Q.when(createScriptsConfFile(ioOptions))
                .then(function (result) {
                    defer.resolve(choices[0]);
               }, function (error) {
                   defer.reject(error);
               }).done();
        } else {
            defer.reject(answer.scripts);
        }
    });

    return defer.promise;

};

module.exports = init;
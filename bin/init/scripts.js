#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var webpack = require('webpack');
var defaultFilesName = require('../dirigentfile');
var cwd = process.cwd();
var choices = ["Yes", "No"];
var indentation = 2;
var createScriptsConfFile = require('./scripts/createConfigFiles.js')
var scripts = {
    name: 'scripts',
    message: 'Would you like dirigent to build your scripts?',
    type: 'list',
    default: 0,
    choices: choices
};

function init() {
    process.stdout.write('\nScripts\n');
    inquirer.prompt(scripts, function (answer) {
        if (answer.scripts === choices[0]) {
            createScriptsConfFile();
        }
    });
}

module.exports = init;
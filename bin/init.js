#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var defaultFilesName = require('./files');
var cwd = process.cwd();

var scripts = {
    name: 'scripts',
    message: 'Would you like dirigent to build your scripts?',
    type: 'list',
    default: 'Yes',
    choices: [
        { Yes: true },
        { No: false }
    ]
};

var styles = {
    name: 'styles',
    message: 'Would you like dirigent to manage your styles?',
    type: 'list',
    default: true,
    choices: [
        { Yes: true },
        { No: false }
    ]
};

function init() {
    inquirer.prompt(styles, function (answer) {
        if (answer.styles) {
            createStylesConfFile();
        }
    });

    inquirer.prompt(scripts, function (answer) {
        if (answer.scripts) {
            createScriptsConfFile();
        }
    });
}

function createScriptsConfFile() {

    var schema = [
        {
            name: 'entry',
            type: 'string',
            default: 'index.js'
        },
        {
            name: 'outputPath',
            type: 'string',
            default: cwd
        },
        {
            name: 'outputFile',
            type: 'string',
            default: 'index.bundle.js'
        }
    ];

    inquirer.prompt(schema, function (answer) {
        var options = {
            entry: answer.entry,
            output: {
                path: answer.outputPath,
                filename: answer.outputFile
            }
        };

        fs.writeFile(path.join(cwd, defaultFilesName.scripts.conf.dev), JSON.stringify(options));
    });

};

function createStylesConfFile() {

    var schema = [
        {
            name: 'file',
            type: 'string',
            default: 'main.scss'
        },
        {
            name: 'outputStyle',
            type: 'list',
            choices: [
                'compact',
                'nested ',
                'expanded',
                'compressed'

            ],
            default: 'compact'
        },
        {
            name: 'sourceMap',
            type: 'list',
            choices: [true, false],
            default: true
        }
    ];

    inquirer.prompt(schema, function (answer) {
        var options = {
            file: answer.file,
            outputStyle: answer.outputStyle,
            sourceMap: answer.outputStyle
        };

        fs.writeFile(path.join(cwd, defaultFilesName.styles.conf.dev), JSON.stringify(options));
    });
}


module.exports = init;
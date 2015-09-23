#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var Q = require('q');
var defaultFilesName = require('./styles/filenames.js');
var cwd = process.cwd();
var choices = ["Yes", "No"];
var stringify = require('./stringify.js');
var ioOptions = require('./IO-options.js');

var styles = {
    name: 'styles',
    message: 'Would you like dirigent to manage your styles?',
    type: 'list',
    default: 0,
    choices: choices
};

var styleDefer = Q.defer();

module.exports = function init() {
    console.log('\nStyles\n');
    inquirer.prompt(styles, function (answer) {
        if (answer.styles === choices[0]) {
            createStylesConfFile();
        } else if (answer.styles === choices[1]) {
            styleDefer.reject(choices[1]);
        }
    });
    return styleDefer.promise;
}

function createStylesConfFile() {

    var schema = [{
            message: 'Which file is the entry point for your module style\'s',
            name: 'file',
            type: 'string',
            default: 'main.scss'
        },
        {
            message: 'Choose the output style for the css',
            name: 'outputStyle',
            type: 'list',
            default: 0,
            choices: [
                'compact',
                'nested ',
                'expanded',
                'compressed'
            ]
        },
        {
            message: 'Do you want source maps to be generated?',
            name: 'sourceMap',
            type: 'list',
            choices: choices,
            default: 0
        }];

    inquirer.prompt(schema, function (answer) {
        var options = {
            file: answer.file,
            outputStyle: answer.outputStyle,
            sourceMap: answer.outputStyle
        };

        fs.writeFile(path.join(cwd, defaultFilesName.styles.conf.dev),
            'module.exports = (' + stringify(options) + ');\n', ioOptions, function () {

                styleDefer.resolve(arguments);
            });

        try {
            var dirigentFile = path.join(cwd, 'dirigentfile.js');
            var dirigentFileJson = require(dirigentFile);
            dirigentFileJson.styles = defaultFilesName;
            fs.writeFile(
                dirigentFile,
                ['module.exports = (', stringify(dirigentFileJson), + ')};'].join('\n'),
                ioOptions);
        } catch (err) {
            process.stderr.write(err);
            fs.writeFile(dirigentFile,
                ['module.exports = (', stringify({ scripts: defaultFilesName }), + ')};'].join('\n'), ioOptions);
        }

    });
}

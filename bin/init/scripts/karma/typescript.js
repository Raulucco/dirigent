#!/usr/bin/env node

'use strict';

var fs = require('fs');
var _ = require('lodash');
var inquirer = require('inquirer');
var questions = require('./questions.js');
var stringify = require('../../stringify.js');
var webpackConfanchor = '%_WEBPACKCONF_%';
var fileName = 'karma.config.js';
var regex = new RegExp('"' + webpackConfanchor + '"');
var fileContent;

inquirer.prompt(questions, function (answers) {
    var lists = ['reporters', 'files', 'frameworks', 'exclude'];

    for (var i = 0; i < lists.length; i++) {

        if (!answers[lists[i]].length) {
            answers[lists[i]] = [];
            continue;
        }
        answers[lists[i]] = string2array(answers[lists[i]]);
    }

    answers.preprocessors = {
        'www/src/**/*.ts': ['webpack', 'sourcemap']
    };

    answers.webpack = webpackConfanchor;

    fileContent = [
        'var webpackConf = require("./webpack.config.js");\n',
        '\n',
        'delete webpackConf.entry;\n',
        'delete webpackConf.output;\n',
        '\n',
        'module.exports = fucntion (config) {\n',
        '  config.set(',
        stringify(answers),
        ');\n}'
    ].join('');

    fileContent = fileContent.replace(regex, 'webpackConf');

    fs.writeFile(fileName,
        fileContent,
        { encoding: 'utf8' });
});

function string2array(str, separator) {
    var array = str.split(separator || ',');
    return _.map(array, function (reporter) {
        return reporter.replace(/^(\s+)?(\w+)(\s+)?$/, '$2');
    });

}
#!/usr/bin/env node

'use strict';

var fs = require('fs');
var _ = require('lodash');
var inquirer = require('inquirer');
var questions = require('./questions.js');
var stringify = require('../../stringify.js');
var webpackConfanchor = '%_WEBPACKCONF_%';
var fileName = 'karma.config.js';

inquirer.prompt(questions, function (answers) {
    var lists = ['reporters', 'files', 'frameworks', 'exclude'];

    for (var i = 0; i < lists.length; i++) {
        answers[lists[i]] = string2array(answers[lists[i]]);
    }

    answers.preprocessors = {
        'www/src/**/*.ts': ['webpack', 'sourcemap']
    };

    answers.webpack = webpackConfanchor;
    fs.writeFile(fileName,
        'var webpackConf = require("./webpack.config.js");\n' +
        '\n' +
        'delete webpackConf.entry;\n' +
        'delete webpackConf.output;\n' +
        '\n' +
        'module.exports = fucntion (config) {\n' +
        '  config.set(' +
        stringify(answers) +
        ');\n}',
        { encoding: 'utf8' },
        setWebpackConf);
});

function setWebpackConf(error) {
    if (error) {
        throw error;
    }

    fs.readFile(fileName, function (err, data) {
        if (err) {
            throw error;
        }
        var regex = new RegExp('"' + webpackConfanchor + '"');
        data = data.replace(regex, 'webpackConf');
        fs.writeFile(fileName, data, { encoding: 'utf8' });
    });

}

function string2array(str, separator) {
    var array = str.split(separator || ',');
    return _.map(array, function (reporter) {
        return reporter.replace(/^\s*(\w)\s*$/, '$1');
    });

}
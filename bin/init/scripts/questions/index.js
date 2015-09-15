#!/usr/bin/env node

'use strict';

var transpilers = require('./choices/transpilers.js');

module.exports =[
        {
            message: 'How is your module call?',
            name: 'moduleName',
            type: 'string',
            default: process.cwd().substr(__dirname.lastIndexOf('\\') + 1)
        },
        {
            message: 'What do you have to say about your module?',
            name: 'description',
            type: 'string',
            default: ''
        },
        {
            message: 'Which version?',
            name: 'version',
            type: 'string',
            default: '0.0.0'
        },
        {
            message: 'How\'s the author?',
            name: 'author',
            type: 'string',
            default: ''
        },
        {
            message: 'Which license?',
            name: 'license',
            type: 'string',
            default: 'MIT'
        },
        {
            message: 'Which name have the entry point of your module?',
            name: 'entry',
            type: 'string',
            default: 'src/index.js'
        },
        {
            message: 'Which is the output path of your module?',
            name: 'outputPath',
            type: 'string',
            default: process.cwd()
        },
        {
            message: 'Which is the output file of your module?',
            name: 'outputFile',
            type: 'string',
            default: 'src/bundle.js'
        },
        {
            message: 'Will you use a transpiler for javascript files?',
            name: 'transpiler',
            type: 'list',
            default: 0,
            choices: transpilers
        }

    ];
#!/usr/bin/env node

'use strict';

module.exports = [
    {
        message: 'base path that will be used to resolve all patterns (eg. files, exclude)',
        name: 'basePath',
        type: 'string',
        default: ''
    },
    {
        message: 'frameworks to use\nEnter mone or multiple values separated by a coma',
        name: 'frameworks',
        type: 'string',
        default: 'jasmine'
    },
    {
        message: 'list of files / patterns to load in the browser\nEnter mone or multiple values separated by a coma',
        name: 'files',
        type: 'string',
        default: 'src/**/*.test.ts'
    },
    {
        message: 'list of files / patterns to exclude\nEnter mone or multiple values separated by a coma',
        name: 'exclude',
        type: 'string',
        default: ''
    },
    {
        message: 'available reporters: https://npmjs.org/browse/keyword/karma-reporter\nEnter mone or multiple values separated by a coma',
        name: 'reporters',
        type: 'string',
        default: 'dots, coverage, progress'
    },
    {
        message: 'web server port',
        name: 'port',
        type: 'number',
        default: 9876
    },
    {
        message: 'enable / disable colors in the output (reporters and logs)',
        name: 'colors',
        type: 'confirm',
        default: true
    },
    {
        message: ' level of logging',
        name: 'logLevel',
        type: 'list',
        choices: ['config.LOG_DISABLE', 'config.LOG_ERROR', 'config.LOG_WARN', 'config.LOG_INFO', 'config.LOG_DEBUG'],
        default: 3
    },
    {
        message: 'A list of browsers to launch and capture. Once Karma is shut down, it will shut down these browsers as well. You can capture any browser manually just by opening a url, where Karma\'s web server is listening.',
        name: 'browsers',
        type: 'checkbox',
        choices: [{ name: 'Chrome', checked: true }, { name: 'Firefox' }, { name: 'IE' }, { name: 'ChromeCanary' }, { name: 'Safari' }, { name: 'Opera' }, { name: 'PhantonJS' }]
    },
    {
        message: 'If true, it captures browsers, runs tests and exits with 0 exit code (if all tests passed) or 1 exit code (if any test failed).',
        name: 'singleRun',
        type: 'confirm',
        default: true
    },
    {
        message: 'Enable or disable watching files and executing the tests whenever one of these files changes.',
        name: 'autoWatch',
        type: 'confirm',
        default: false
    },
];
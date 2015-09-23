#!/usr/bin/env node

'use strict';

var stringify = require('./init/stringify.js');

module.exports = {
    logWithParams: function () {
        process.stdout.write('\n***********************\n');
        process.stdout.write('\nARV\n');
        process.stderr.write('\nprocess ' + process.pid + ' with params:\n');
        process.stderr.write(process.argv.join('\n'));
        process.stdout.write('\n***********************\n');
    },

    logFilename: function (filename) {
        process.stdout.write('\n***********************\n');
        process.stdout.write('\nFILENAME\n');
        process.stderr.write('\nprocess ' + process.pid + ' executing file:\n');
        process.stderr.write(filename + '\n');
        process.stdout.write('\n***********************\n');
    },
    logErrorMessage: function (error) {
        process.stdout.write('\n***********************\n');
        process.stdout.write('\nERROR\n');
        process.stderr.write('\nprocess ' + process.pid + ' :\n');
        process.stderr.write(error.message + '\n');
        process.stdout.write('\n***********************\n');
    },
    logMessage: function (message) {
        process.stdout.write('\n***********************\n');
        process.stdout.write('\nMESSAGE\n');
        process.stdout.write('\nprocess ' + process.pid + ' :\n');
        process.stdout.write(message + '\n');
        process.stdout.write('\n***********************\n');
    },
    logObject: function (obj, message) {
        process.stdout.write('\n***********************\n');
        process.stdout.write('\n' + message + '\n');
        process.stdout.write('\nprocess ' + process.pid + ' :\n');
        process.stdout.write(stringify(obj) + '\n');
        process.stdout.write('\n***********************\n');
    }
};
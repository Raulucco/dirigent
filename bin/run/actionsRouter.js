#!/usr/bin/env node

'use strict';
var path = require('path');
var fs = require('fs');
var Q = require('q');
var logger = require('../logUtils.js');
var childProcessFactory = require('./createChildProcess.js');
var files = require('./actions.js');

module.exports = function resolveAction() {
    logger.logWithParams();
    logger.logFilename(__filename);
    var defer = Q.defer();
    var opts;
    var promise;

    switch (process.argv[3]) {
        case 'styles':
        case 'styles:dev':
            opts = process.argv.slice(1);
            opts.unshift('dev');
            promise = createChildProcess(files.styles, opts, 'dev');
            break;
        case 'scripts':
        case 'scripts:dev':
            opts = process.argv.slice(1);
            opts.unshift('dev');
            promise = createChildProcess(files.scripts, opts, 'dev');
            break;
        case 'scripts:deploy':
            opts = process.argv.slice(1);
            opts.unshift('deploy');
            promise = createChildProcess(files.scripts, opts, 'deploy');
            break;
        case 'styles:deploy':
            opts = process.argv.slice(1);
            opts.unshift('deploy');
            promise = createChildProcess(files.styles, opts, 'deploy');
            break;
        case 'dev':
            promise = Q.all([
                createChildProcess(files.scripts, process.argv.slice(1), 'dev'),
                createChildProcess(files.styles, process.argv.slice(1), 'dev')
            ]);

            break;
        case 'deploy':
            opts.unshift('deploy');
            promise = Q.all([
                createChildProcess(files.scripts, process.argv.slice(1), 'deploy'),
                createChildProcess(files.styles, process.argv.slice(1), 'deploy')
            ]);

            break;
        case 'test':
            promise = createChildProcess(files.test, process.argv.slice(1), 'test');
            break;
        default:
            throw 'Error: ' + process.argv.slice(2) + ' is not a valid option.\n Read the README';
    }

    Q.when(promise).then(function (success) {
        logger.logFilename(__filename);
        console.log('Running from ', process.cwd());
        console.log('Resolved Action promise', success);
        logger.logWithParams();
        defer.resolve(success);
    }, function (error) {
        logger.logFilename(__filename);
        console.log('Running from ', process.cwd());
        console.log('Reject Action promise', error);
        logger.logWithParams();
        defer.reject(error);
    });

    return defer.promise;
}

function createChildProcess(file, opts, env) {
    var defer = Q.defer();
    opts.unshift(path.resolve(__dirname, file));
    console.log(opts.join('\n'), env);
    Q.when(childProcessFactory('node', opts, {
        cwd: process.cwd(),
        env: {
            dirigentMode: env
        },
        encoding: 'utf8'
    })).then(function (success) {
        console.log(__filename);
        console.log('Running from ', process.cwd());
        console.log('Resolved Action promise', success);
        console.log('With params', process.argv.join('\n'));
        defer.resolve(success);
    }, function (error) {
        console.log(__filename);
        console.log('Running from ', process.cwd());
        console.log('Reject Action promise', error);
        console.log('With params', process.argv.join('\n'));
        defer.reject(error);
    });

    return defer.promise;
}
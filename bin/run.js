#!/usr/bin/env node

'use strict';
var child = require('child_process');
var path = require('path');
var files = {
    styles: 'styles.js',
    scripts: 'scripts.js'
};

switch (process.argv[3]) {
    case 'styles':
    case 'styles:dev':
        createChildProcess(files.styles);
        var opts = process.argv.slice(1);
        opts.unshift('dev');
        createChildProcess(files.styles, opts);
        break;
    case 'scripts':
    case 'scripts:dev':
        var opts = process.argv.slice(1);
        opts.unshift('dev');
        createChildProcess(files.scripts, opts);
        break;
    case 'scripts:deploy':
        var opts = process.argv.slice(1);
        opts.unshift('deploy');
        createChildProcess(files.scripts, opts);
        break;
    case 'styles:deploy':
        var opts = process.argv.slice(1);
        opts.unshift('deploy');
        createChildProcess(files.styles, opts);
        break;
    case 'dev':
        createChildProcess(files.scripts, process.argv.slice(1));
        createChildProcess(files.styles, process.argv.slice(1));
        break;
    case 'deploy':
        opts.unshift('deploy');
        createChildProcess(files.scripts, process.argv.slice(1));
        createChildProcess(files.styles, process.argv.slice(1));
        break;
    default:
        throw 'Error: ' + process.argv.slice(2) + ' is not a valid option.\n Read the README';
}

function createChildProcess(file, opts) {

    opts.unshift(file);
    var command = child.execFile('node' , opts);

    command.on('error', function (err) {
        console.log(err);
    });

    command.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    command.stdout.pipe(process.stdout);
}
#!/usr/bin/env node

'use strict';
var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var files = {
    styles: 'styles.js',
    scripts: 'scripts.js'
};

function iterator(dirigent, cwd) {

    fs.exists(path.join(cwd || process.cwd(), 'dirigentfile.js'), function (exists) {
        var config;
        if (exists) {
            config = require(process.cwd(), 'dirigentfile.js');
        } else {
            config = require(path.join(__dirname, 'dirigentfile.js'));
        }

        for (var i = 0; i < config.deps.length; i++) {
            dirigent.launch({}, resolveAction);
            iterator(dirigent, config.deps[i]);
        }
    });
}

function resolveAction() {

    switch (process.argv[3]) {
        case 'styles':
        case 'styles:dev':
            //createChildProcess(path.join(process.cwd(),  files.styles));
            var opts = process.argv.slice(1);
            opts.unshift('dev');
            createChildProcess(path.join(process.cwd(), files.styles), opts);
            break;
        case 'scripts':
        case 'scripts:dev':
            var opts = process.argv.slice(1);
            opts.unshift('dev');
            createChildProcess(path.join(process.cwd(), files.scripts), opts);
            break;
        case 'scripts:deploy':
            var opts = process.argv.slice(1);
            opts.unshift('deploy');
            createChildProcess(path.join(process.cwd(), files.scripts), opts);
            break;
        case 'styles:deploy':
            var opts = process.argv.slice(1);
            opts.unshift('deploy');
            createChildProcess(path.join(process.cwd(), files.styles), opts);
            break;
        case 'dev':
            createChildProcess(path.join(process.cwd(), files.scripts), process.argv.slice(1));
            createChildProcess(path.join(process.cwd(), files.styles), process.argv.slice(1));
            break;
        case 'deploy':
            opts.unshift('deploy');
            createChildProcess(path.join(process.cwd(), files.scripts), process.argv.slice(1));
            createChildProcess(path.join(process.cwd(), files.styles), process.argv.slice(1));
            break;
        default:
            throw 'Error: ' + process.argv.slice(2) + ' is not a valid option.\n Read the README';
    }

}

function createChildProcess(file, opts) {

    opts.unshift(file);
    var command = child.execFile('node', opts);

    command.on('error', function (err) {
        console.log(err);
    });

    command.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    command.stdout.pipe(process.stdout);
}

module.exports = iterator;
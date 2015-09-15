#!/usr/bin/env node

'use strict';
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var files = {
    styles: './styles.js',
    scripts: './scripts.js'
};

function iterator(dirigent, cwd) {
    cwd = cwd || process.cwd();
    console.log(cwd);
    fs.exists(path.join(cwd.path ? cwd.path : cwd, 'dirigentfile.js'), function (exists) {
        var config;
        if (exists) {

            config = require(path.resolve(cwd.path ? cwd.path : cwd, 'dirigentfile.js'));
        } else {
            config = require(path.join(__dirname, '../dirigentfile.js'));
        }

        if (config.hasOwnProperty('deps')) {
            for (var i = 0; i < config.deps.length; i++) {
                dirigent.launch({
                    cwd: config.deps[i].path
                }, resolveAction);
                iterator(dirigent, config.deps[i]);
            }
        }

        dirigent.launch({}, resolveAction);
    });
}

function resolveAction(env) {

    if (process.cwd() !== path.resolve(env.cwd)) {
        process.chdir(path.resolve(env.cwd));
        console.log('Working directory changed to', env.cwd);
    }

    console.log(process.argv[3]);
    switch (process.argv[3]) {
        case 'styles':
        case 'styles:dev':
            var opts = process.argv.slice(1);
            opts.unshift('dev');
            createChildProcess(files.styles, opts, 'dev');
            break;
        case 'scripts':
        case 'scripts:dev':
            var opts = process.argv.slice(1);
            opts.unshift('dev');
            createChildProcess(files.scripts, opts, 'dev');
            break;
        case 'scripts:deploy':
            var opts = process.argv.slice(1);
            opts.unshift('deploy');
            createChildProcess(files.scripts, opts, 'deploy');
            break;
        case 'styles:deploy':
            var opts = process.argv.slice(1);
            opts.unshift('deploy');
            createChildProcess(files.styles, opts, 'deploy');
            break;
        case 'dev':
            createChildProcess(files.scripts, process.argv.slice(1), 'dev');
            createChildProcess(files.styles, process.argv.slice(1), 'dev');
            break;
        case 'deploy':
            opts.unshift('deploy');
            createChildProcess(files.scripts, process.argv.slice(1), 'deploy');
            createChildProcess(files.styles, process.argv.slice(1), 'deploy');
            break;
        default:
            throw 'Error: ' + process.argv.slice(2) + ' is not a valid option.\n Read the README';
    }

}

function createChildProcess(file, opts, env) {
    opts.unshift(path.resolve(__dirname, file));
    child_process.exec('node ' + opts.join(' '), { env: { dirigentMode: env, modulePath: process.cwd() } }, function (error, stdout, stderr) {

        console.error(stderr);
        console.log(stdout);
    });

}

module.exports = iterator;
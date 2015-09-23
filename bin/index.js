#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

switch (process.argv[2]) {
    case 'init':
        console.log('Running initialization of module');
        require('./init/index.js')();
        break;
    case 'run':
        console.log('Running compilation of module');
        require('./run/index.js');
        break;
    case 'setup:karma':
        console.log('Setup karma of module');
        require('./init/scripts/karma/default.js');
        break;
    default:
        console.log('Unable to take an action => \n', process.argv);
        process.stderr.write('No action => ' + process.argv.join('\n\t') + '\n');
        console.log(process.argv, process.cwd());
        fs.readFile(path.join(__dirname, '../README.md'), function (err, data) {
            if (err) throw err;

            process.stdout.write(data.toString().replace(/\[([^\]]+)\]\([^\)]+\)/gm, '$1'));

            process.exit(1);
        });
}

process.on('error', function () {
    process.exit(1);
});
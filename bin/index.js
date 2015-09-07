#!/usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var dirigent = new Liftoff({
    name: 'dirigent',
    extensions: {
        '.js': null,
        '.json': null,
        '.ts': 'typescript-register'
    }
});

switch (process.argv[2]) {
    case 'init':
        var init = require('./init.js');
        dirigent.launch({}, init);
        break;
    case 'run':
        require('./run.js')(dirigent);
        break;
}
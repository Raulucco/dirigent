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
        var init = require('./init/index.js');
        dirigent.launch({}, init);
        break;
    case 'run':
        require('./run/index.js')(dirigent);
        break;
    case 'setup:karma:typescript':
        require('./init/karma/typescript.js');
        break;
    case 'setup:karma:es6':
        require('./init/karma/typescript.js');
        break;
    case 'setup:karma':
        require('./init/karma/default.js');
        break;
}
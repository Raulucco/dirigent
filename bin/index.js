#!/usr/bin/env node

'use strict';

switch (process.argv[2]) {
    case 'init':
        require('./init.js');
        break;
    case 'run':
        require('./run.js');
        break;
}
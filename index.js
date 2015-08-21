'use strict';

if (/init/.test(process.argv[1])) {
    require('./init.js');
}

if (/run/.test(process.argv[1])) {
    require('./run.js');
}
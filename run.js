'use strict';
var child = require('child_process');

if (/scripts/.test(process.argv[2])) {
    child.spawn('npm scripts:task', process.argv.slice(2), {cwd: process.cwd()});
 }

if (/styles/.test(process.argv[2])) {
    child.spawn('npm styles:task', process.argv.slice(2), {cwd: process.cwd()});
}
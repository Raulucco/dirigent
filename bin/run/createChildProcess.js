#!/usr/bin/env node
var Q = require('q');
var child_process = require('child_process');

'use strict';

module.exports = (function () {
    return function createChildProcess(command, opts, env) {
        var defer = Q.defer();
        var child = child_process.exec([command].concat(opts).join(' '), env);

        child.stderr.pipe(process.stderr);
        child.stdout.pipe(process.stdout);

        process.on('error', function () {
            killProcess(child.pid);
        });

        child.on('exit', function (event) {
            defer.resolve(event);
        });

        child.on('error', function (error) {
            defer.reject(error);
        });

        return defer.promise;
    };

    function killProcess(pid) {
        if (/^win/.test(process.platform)) {
            child_process.exec('taskkill /PID' + pid + ' /T /F');
        } else {
            process.kill(pid);
        }

    }

})();
#!/usr/bin/env node

'use strict';
var path = require('path');
var child_process = require('child_process');
var Q = require('q');
var logger = require('../logUtils.js');
var resolveAction = require('./actionsRouter.js');

module.exports = (function () {
    var cwd = process.cwd();
    return function iterator() {
        console.log(__filename);
        console.log('-Beginning to iterate');
        var promisses = [];
        var defer = Q.defer();
        var conf = getModuleConf();

        Q.when(resolveAction()).then(function (success) {
            console.log('Everything ok', success);
            if (conf.hasOwnProperty('deps')) {
                for (var i = 0; i < conf.deps.length; i++) {
                    promisses.push(execDep(i));
                }
            }

            Q.all(promisses).then(function (success) {
                defer.resolve(success);
            }, function (error) {
                defer.reject(error);
            });

        }, function (error) {
            console.log('Failed',error, '\n');
            defer.reject(error);
        });

        return defer.promise;

        function execDep(index) {
            console.log('Execute dependencies\n', cwd, '=>', conf.deps[index]);
            if (cwd !== conf.deps[index]) {
                var d = Q.defer();
                console.log(process.argv.slice(1), __filename);
                var child = child_process.exec(
                    'dirigent ' + process.argv.slice(2).join(' '),
                    { cwd: conf.deps[index] });
                child.stderr.pipe(process.stderr);
                child.stdout.pipe(process.stdout);
                promisses.push(d.promise);

                child.on('exit', function () {
                    d.resolve(0);
                });

                child.on('error', function () {
                    d.reject(1);
                });

                return d.promise;
            }

        }


    };

    function getModuleConf() {
        try {
            console.log('Getting module conf relative on ' + cwd);
            var dirigentFile = path.join(cwd, 'dirigentfile.js');
            return require(dirigentFile);
        } catch (err) {
            console.log('Getting module conf relative on ' + __dirname);
            process.stderr.write(err.message);
            logger.logWithParams();
            return require(path.join(__dirname, 'conf/dirigentfile.js'));
        }
    }
})();
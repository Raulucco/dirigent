#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var Q = require('q');
var _ = require('lodash');
var stringify = require('./stringify.js');
var decorateJson = require('./decorateJsonConf.js');
var defaultFilesName = require('./scripts/filenames.js');
var packageFileProps = require('./scripts/base-package-file.js');
var scriptsTranspilers = require('./scripts/questions/choices/transpilers.js');
var excludes = require('./scripts/questions/choices/exclude.js').dirs;
var cwd = process.cwd();
var ioOptions;

function createScriptsConfFile(_ioOptions) {
    ioOptions = _ioOptions;
    var schema = require('./scripts/questions/index.js');
    var defer = Q.defer();
    var promisses = [];

    inquirer.prompt(schema, function (answer) {
        var options = {
            context: cwd,
            entry: answer.entry,
            output: {
                path: answer.outputPath,
                filename: answer.outputFile
            },
            watch: false,
            devtool: 'source-map',
            plugins: []
        };

        var packagejson = _.merge({}, {
            name: answer.moduleName,
            description: answer.description,
            version: answer.version,
            author: answer.author,
            license: answer.license,
            main: answer.entry,

        }, packageFileProps);

        if (answer.transpiler === scriptsTranspilers[0]) {
            packagejson.devDependencies.tsd = '^0.6.4';
            packagejson.devDependencies['tslint-loader'] = '^1.0.1';
            packagejson.devDependencies['ts-loader'] = '^0.5.5';
            packagejson.devDependencies.typescript = '^1.5.3';

            fs.writeFile(path.join(cwd, 'tsdconfig.json'),
                stringify({
                    compilerOptions: {
                        module: 'commonjs',
                        noImplicitAny: true,
                        removeComments: true,
                        preserveConstEnums: true,
                        sourceMap: true
                    },
                    files: [],
                    exclude: excludes
                }), ioOptions);
            var tslintjson = require('./scripts/linting/ts.js');
            fs.writeFile(path.join(cwd, 'tslint.json'), stringify(tslintjson), ioOptions);

            options.resolve = {
                extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
            };

            options.module = {
                loaders: [{
                    test: '/\.ts$/',
                    loader: 'ts-loader',
                    exclude: excludes.join('|')
                }],
                preLoaders: [{
                    test: '/\.ts$/',
                    exclude: excludes.join('|'),
                    loader: "tslint"
                }]
            };

        } else if (answer.transpiler === scriptsTranspilers[1]) {
            packagejson.devDependencies['babel-loader'] = '^5.3.2';
            packagejson.devDependencies['eslint-loader'] = '^1.0.0';

            options.module = {
                loaders: [{
                    test: '/\.jsx?$/',
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel?optional[]=runtime&stage=0'
                },
                    {
                        test: '/\.js$/',
                        loader: 'eslint-loader',
                        exclude: excludes.join('|')
                    }]
            };
        } else if (answer.transpiler === scriptsTranspilers[2]) {
            packagejson.devDependencies['coffee-loader'] = '^0.7.2';

            options.module = {
                loaders: [{
                    test: '/\.coffee$/',
                    loader: 'coffee-loader'
                },
                    {
                        test: '/\.(coffee\.md|litcoffee)$/',
                        loader: 'coffee-loader?literate'
                    }],
                preLoaders: [{
                    test: '/\.coffee$/',
                    exclude: excludes.join('|'),
                    loader: 'coffeelint-loader'
                }]
            };

        } else {
            packagejson['jshint-loader'] = '^0.8.3';
            options.module = {
                preLoaders: [
                    {
                        test: '/\.js$/',
                        exclude: excludes.join('|'),
                        loader: 'jshint-loader'
                    }
                ]
            };
        }

        promisses.push(writeWebPackConfFiles(options).done());
        promisses.push(writePackageJson(packagejson).done());
        promisses.push(writeDirigentConfFile().done());

        Q.all(promisses).then(function () {
            defer.resolve(arguments);
        }, function () {
            defer.reject(arguments);
        }).done();
    });

    return defer.promise;
};

function writeWebPackConfFiles(options) {
    var defer = Q.defer();
    var devContent = 'var webpack = require(\'webpack\');\n' + decorateJson(options);

    devContent = normalizeEntry(devContent);
    devContent = normalizePlugins(devContent);
    devContent = normalizeExclude(devContent);
    devContent = normalizeTest(devContent);

    fs.writeFile(path.join(cwd, defaultFilesName.dev),
        devContent,
        ioOptions, function (error, data) {
            if (error) {
                defer.reject(error);
                return;
            }
            devContent = devContent
                .replace(/,\n"watch":\strue/, '')
                .replace(/,\n"devtool":\s[^,]+/, '');

            fs.writeFile(
                path.join(cwd, defaultFilesName.deploy),
                devContent, ioOptions, function (error, _data) {
                    if (error) {
                        defer.reject(error);
                        return;
                    }

                    defer.resolve([data, _data]);
                });
        });

    return defer.promise;
}

function normalizeEntry(str) {
    return str.replace(/^(\s+)"entry":\s"(\w+\.\w+)"(,)?$/m,
        '$1"entry": __dirname + "$2"$3');
}

function normalizePlugins(str) {
    return str.replace(/^(\s*)"plugins":\s\[\](,?)$/mg,
        '$1"plugins": [ new webpack.optimize.UglifyJsPlugin() ]$2')
}

function normalizeExclude(str) {
    return str.replace(/^(\s*)"exclude":\s"([^,\n"]+)"(,?)$/gm,
        '$1"exclude": /$2/$3');
}

function normalizeTest(str) {
    return str.replace(/^(\s*)"test":\s"\/([^,\n]+)\/(,?)"/gm,
        '$1"test": /$2/$3');
}

function writePackageJson(packagejson) {
    var defer = Q.defer();
    fs.writeFile(
        path.join(cwd, 'package.json'),
        stringify(packagejson), ioOptions,
        function (err, data) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(data);
            }

        });
    return defer.promise;
}

function writeDirigentConfFile() {
    var dirigentFile = path.join(cwd, 'dirigentfile.js');
    var defer = Q.defer();
    try {
        var dirigentFileJson = require(dirigentFile);
        dirigentFileJson.scripts = defaultFilesName;
        fs.writeFile(dirigentFile,
            decorateJson(dirigentFileJson), ioOptions, resolvePromise);
    } catch (err) {
        process.stderr.write(err.message);
        fs.writeFile(dirigentFile,
            decorateJson({ scripts: defaultFilesName }), ioOptions, resolvePromise);
    }

    function resolvePromise(err, data) {
        if (err) {
            process.stderr.write('\n' + err.message + '\n');
            defer.reject(err);
            process.exit(1);
        }
        defer.resolve(data);
    }

    return defer.promise;
}

module.exports = createScriptsConfFile;
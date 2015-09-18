#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var _ = require('lodash');

var stringify = require('../stringify.js');
var defaultFilesName = require('./filenames.js');
var packageFileProps = require('./base-package-file.js');
var scriptsTranspilers = require('./questions/choices/transpilers.js');
var excludes = require('./questions/choices/exclude.js').dirs;

var encoding = { encoding: 'utf8' };
var cwd = process.cwd();

module.exports = function createScriptsConfFile() {

    var schema = require('./questions/index.js');

    inquirer.prompt(schema, function (answer) {
        var options = {
            context: cwd,
            entry: /^\//.test(answer.entry) ? answer.entry.replace(/^\//, '') : answer.entry,
            output: {
                path: answer.outputPath,
                filename: answer.outputFile
            },
            watch: true,
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
                }), encoding);

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

        var devContent = 'var webpack = require(\'webpack\');\nmodule.exports = (' + stringify(options) + ');\n';

        devContent = devContent.replace(
            /^(\s+)"entry":\s"(\w+\.\w+)"(,)?$/m,
            '$1"entry": __dirname + "$2"$3');

        devContent = devContent.replace(
            /^(\s*)"plugins":\s\[\](,?)$/mg,
            '$1"plugins": [ new webpack.optimize.UglifyJsPlugin() ]$2');

        devContent = devContent.replace(
            /^(\s*)"exclude":\s"([^,\n"]+)"(,?)$/gm,
            '$1"exclude": /$2/$3');

        devContent = devContent.replace(
            /^(\s*)"test":\s"\/([^,\n]+)\/(,?)"/gm,
            '$1"test": /$2/$3');

        fs.writeFile(path.join(cwd, defaultFilesName.conf.dev),
            devContent,
            encoding, function (error) {
                if (!error) {

                    devContent = devContent.replace(/,\n"watch":\strue/, '');
                    devContent = devContent.replace(/,\n"devtool":\s[^,]+/, '');

                    fs.writeFile(
                        path.join(cwd, defaultFilesName.conf.deploy),
                        devContent,
                        encoding);

                } else {
                    throw error;
                }
            });

        fs.writeFile(path.join(cwd, 'package.json'), stringify(packagejson), encoding);
    });
};
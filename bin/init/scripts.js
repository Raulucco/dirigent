#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var webpack = require('webpack');
var defaultFilesName = require('../dirigentfile');
var cwd = process.cwd();
var choices = ["Yes", "No"];
var scriptsTranspilers = ['typescript', 'babel', 'coffescript', 'none'];
var indentation = 2;
var scripts = {
    name: 'scripts',
    message: 'Would you like dirigent to build your scripts?',
    type: 'list',
    default: 0,
    choices: choices
};

var excludes = ["node_modules", "bower_components", "libs", "vendors", "3rdParty"];
var encoding = { encoding: 'utf8' };

function init() {
    console.log('\nScripts\n');
    inquirer.prompt(scripts, function (answer) {
        if (answer.scripts === choices[0]) {
            createScriptsConfFile();
        }
    });
}

function createScriptsConfFile() {

    var schema = [
        {
            message: 'How is your module call?',
            name: 'moduleName',
            type: 'string',
            default: process.cwd().substr(__dirname.lastIndexOf('\\') + 1)
        },
        {
            message: 'What do you have to say about your module?',
            name: 'description',
            type: 'string',
            default: ''
        },
        {
            message: 'Which version?',
            name: 'version',
            type: 'string',
            default: '0.0.0'
        },
        {
            message: 'How\'s the author?',
            name: 'author',
            type: 'string',
            default: ''
        },
        {
            message: 'Which license?',
            name: 'license',
            type: 'string',
            default: 'MIT'
        },
        {
            message: 'Which name have the entry point of your module?',
            name: 'entry',
            type: 'string',
            default: 'src/index.js'
        },
        {
            message: 'Which is the output path of your module?',
            name: 'outputPath',
            type: 'string',
            default: cwd
        },
        {
            message: 'Which is the output file of your module?',
            name: 'outputFile',
            type: 'string',
            default: 'src/bundle.js'
        },
        {
            message: 'Will you use a transpiler for javascript files?',
            name: 'transpiler',
            type: 'list',
            default: 0,
            choices: scriptsTranspilers
        }

    ];

    inquirer.prompt(schema, function (answer) {
        var options = {
            entry: answer.entry,
            output: {
                path: answer.outputPath,
                filename: answer.outputFile
            },
            watch: true,
            devtool: 'source-map',
            plugins: []
        };

        var packagejson = {
            name: answer.moduleName,
            description: answer.description,
            version: answer.version,
            author: answer.author,
            license: answer.license,
            main: answer.entry,
            scripts: {
                test: ".\\node_modules\\.bin\\karma start"
            },
            devDependencies: {
                "webpack": "^1.11.0",
                "node-sass": "^3.2.0",
                "karma": "^0.13.9",
                "karma-webpack": "^1.7.0",
                "karma-chrome-launcher": "^0.2.0",
                "karma-jasmine": "^0.3.6",
                "karma-ie-launcher": "^0.2.0",
                "karma-firefox-launcher": "^0.1.6",
                "karma-coverage": "^0.5.2"
            }
        };

        if (answer.transpiler === scriptsTranspilers[0]) {
            packagejson.devDependencies.tsd = "^0.6.4";
            packagejson.devDependencies['typescript-loader'] = "^1.1.3";
            packagejson.devDependencies.typescript = "^1.5.3";

            fs.writeFile(path.join(cwd, 'tsdconfig.json'), JSON.stringify({
                "compilerOptions": {
                    "module": "commonjs",
                    "noImplicitAny": true,
                    "removeComments": true,
                    "preserveConstEnums": true,
                    "sourceMap": true
                },
                "files": [],
                "exclude": ["node_modules", "bower_components", "libs", "vendors", "3rdParty"]
            }, null, indentation), encoding);

            options.resolve = {
                extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
            };

            options.module = {
                loaders: [{ test: '/\.ts$/', loader: 'typescript-loader', exclude: excludes.join('|') }],
                preLoaders: [
                    {
                        test: '/\.ts$/',
                        exclude: excludes.join('|'),
                        loader: "tslint"
                    }
                ]
            };

        } else if (answer.transpiler === scriptsTranspilers[1]) {
            packagejson.devDependencies['babel-loader'] = "^5.3.2";
            packagejson.devDependencies['eslint-loader'] = "^1.0.0";

            options.module = {
                loaders: [
                    {
                        test: '/\.jsx?$/',
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel?optional[]=runtime&stage=0'
                    },
                    { test: '/\.js$/', loader: "eslint-loader", exclude: excludes.join('|') }
                ]
            };
        } else if (answer.transpiler === scriptsTranspilers[2]) {
            packagejson.devDependencies['coffee-loader'] = '^0.7.2';

            options.module = {
                loaders: [
                    { test: '/\.coffee$/', loader: "coffee-loader" },
                    { test: '/\.(coffee\.md|litcoffee)$/', loader: "coffee-loader?literate" }
                ],
                preLoaders: [
                    {
                        test: '/\.coffee$/',
                        exclude: excludes.join('|'),
                        loader: "coffeelint-loader"
                    }
                ]
            };

        } else {
            packagejson['jshint-loader'] = '^0.8.3';
            options.module = {
                preLoaders: [
                    {
                        test: '/\.js$/',
                        exclude: excludes.join('|'),
                        loader: "jshint-loader"
                    }
                ]
            };
        }

        var devContent = 'var webpack = require(\'webpack\');\nmodule.exports = (' + JSON.stringify(options, null, indentation) + ');\n';

        console.log(devContent);

        devContent = devContent.replace(/^(\s*)"plugins":\s\[\](,?)$/mg, '$1"plugins": [ new webpack.optimize.UglifyJsPlugin() ]$2');
        devContent = devContent.replace(/^(\s*)"exclude":\s([^,\n]+)(,?)$/gm, '$1"exclude": new RegExp($2)$3');
        devContent = devContent.replace(/^(\s*)"test":\s"\/([^,\n]+)\/(,?)"/gm, '$1"test": new RegExp("$2")$3');
        fs.writeFile(path.join(cwd, defaultFilesName.scripts.conf.dev),
            devContent,
            encoding, function (error) {
                if (!error) {

                    devContent = devContent.replace(/,\n"watch":\strue/, '');
                    devContent = devContent.replace(/,\n"devtool":\s[^,]+/, '');

                    fs.writeFile(
                        path.join(cwd, defaultFilesName.scripts.conf.deploy),
                        devContent,
                        encoding);

                } else {
                    throw error;
                }
            });

        fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(packagejson, null, indentation), encoding);
    });

};

module.exports = init;
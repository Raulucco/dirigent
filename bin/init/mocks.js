#!/usr/bin/env node

'use strict';

var answers = {
    createJsConfFiles: {
        'moduleName': 'Testmodule',
        'description': 'Testdescription',
        'version': '0.0.0',
        'author': 'Testuser',
        'license': 'MIT',
        'entry': './src/index.js',
        'outputPath': './src',
        'outputFile': 'bundle.js',
        'transpiler': 'none',
    }
};

module.exports = {
    inquirers: {
        doNotBuildScripts: {
            prompt: function (questions, cb) {
                cb({ scripts: "No" });
            }
        },

        buildScripts: {
            prompt: function (questions, cb) {
                cb({ scripts: "Yes" });
            }
        },

        createConfFilesForJs: {
            prompt: function (schema, cb) {
                cb(respond(schema, 'createJsConfFiles'));
            }
        },

        createConfFilesForTs: {
            prompt: function (schema, cb) {
                var answers = respond(schema, 'createJsConfFiles');
                answers.transpiler = 'typescript';
                cb(answers);
            }
        },

        createConfFilesForEs6: {
            prompt: function (schema, cb) {
                var answers = respond(schema, 'createJsConfFiles');
                answers.transpiler = 'es6';
                cb(answers);
            }
        }

    }
};

function respond(schema, key) {
    var i = 0;
    var len = schema.length;
    var obj = {};
    for (; i < len; i++) {
        obj[schema[i].name] = answers[key][schema[i].name];
    }
    return obj;
}
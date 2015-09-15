#!/usr/bin/env node

'use strict';

module.exports = {
    scripts: {
        test: './node_modules/.bin/karma start'
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
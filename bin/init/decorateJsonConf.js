#!/usr/bin/env node

'use strict';

var stringify = require('./stringify.js');

module.exports = function decorateJsonConf(conf) {
    return ['module.exports = (', stringify(conf), ');'].join('\n');
};
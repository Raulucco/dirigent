#!/usr/bin/env node

'use strict';

var Q = require('q');

Q.fcall(require('./iterator.js')).finally(function () {
    process.exit(0);
});
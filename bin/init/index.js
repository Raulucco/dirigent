#!/usr/bin/env node

var Q = require('q');
'use strict';

function init() {
    var scripts = require('./scripts.js');
    var styles = require('./styles.js');
    Q.fcall(styles).finally(scripts);

    //styles();
}

module.exports = init;
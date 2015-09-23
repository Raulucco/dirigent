#!/usr/bin/env node

'use strict';

var Q = require('q');

module.exports = (function () {
    var scripts = require('./scripts.js');
    var styles = require('./styles.js');

    return function init() {
        callStyles().finally(function () {
            callScripts().finally(function () {
                process.exit(0);
            });
        });
    };

    function callStyles() {
        return Q.fcall(styles);
    }

    function callScripts() {
        return Q.fcall(scripts);
    }

})();
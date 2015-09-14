#!/usr/bin/env node

'use strict';

var Q = require('q');
'use strict';

function init() {
    var scripts = require('./scripts.js');
    var styles = require('./styles.js');
    Q.fcall(styles).finally(scripts);
}

module.exports = init;
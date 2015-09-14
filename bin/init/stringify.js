#!/usr/bin/env node

'use strict';

var _indentation = 2;

module.exports = function (obj, parser, indentation) {
    return JSON.stringify(obj, parser, indentation || _indentation);
}
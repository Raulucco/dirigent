#!/usr/bin/env node

'use strict';

var _indentation = 2;

module.exports = function (obj, parser, indentation) {

    var cache = [];
    function defaultParser(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }
            cache.push(value);
        }
        return value;
    }


    return JSON.stringify(obj, parser || defaultParser, indentation || _indentation);
}
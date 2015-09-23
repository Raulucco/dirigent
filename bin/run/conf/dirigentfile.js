#!/usr/bin/env node

'use strict';

module.exports = ({
    scripts: {
        conf: {
            dev: 'dev.webpack.config.js',
            deploy: 'deploy.webpack.config.js'
        }
    },
    styles: {
        conf: {
            dev: 'dev.libsass.config.js',
            deploy: 'env.libsass.config.js'
        }
    },
    /* deps: [
         process.cwd()
     ]*/
});
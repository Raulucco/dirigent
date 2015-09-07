var path = require('path');
var cwd = process.cwd();

module.exports = ({
    entry: path.join(cwd, 'index.js'),
    output: {
        path: cwd,
        filename: 'bundle.js'
    }
});
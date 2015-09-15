var path = require('path');
var cwd = process.cwd();
var webpack = require('webpack');

module.exports = ({
    dev: {
        entry: path.join(cwd, 'index.js'),
        output: {
            path: cwd,
            filename: 'bundle.js'
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
        },
        cache: true,
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader' }
            ]
        }
    },
    deploy: {
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ],
        cache: true,
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader' }
            ]
        }
    }
});
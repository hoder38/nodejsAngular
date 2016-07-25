const webpack = require('webpack');
require('babel-polyfill');

module.exports = {
    entry: ['babel-polyfill', './src/front/index.js'],
    output: {
        path: './public',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            //{ test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
 };

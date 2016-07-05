const webpack = require('webpack');

module.exports = {
    entry: './src/front/index.js',
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
        })
    ]
 };

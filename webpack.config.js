var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './src/front/index.js'],
    output: {
        path: './public',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            { test: /\.css$/,
                loader: 'style!css'
            },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url?limit=10000&minetype=application/font-woff"
            },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file"
            },
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

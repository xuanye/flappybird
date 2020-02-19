const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = {
    mode: 'production',
    output: {publicPath: "./"},
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        minimizer: [new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false //use it for removing comments like "/*! ... */"
                }
            }
        })]
    },
    plugins: [

        new CopyWebpackPlugin([{
			from: './src/assets',
			to: './assets'
		}]),
		new HTMLWebpackPlugin({
			template: './index.html',
            filename: 'index.html',
            hash: true,
            minify: false
        }),
        new WebpackCdnPlugin({
            modules: [
              {
                name: 'pixi.js',
                var: 'PIXI',
                path: 'dist/pixi.min.js'
              },
              {
                name: 'animejs',
                var: 'anime',
                path: 'lib/anime.min.js'
              }
            ],
            publicPath: '/node_modules'
        })
    ]
}
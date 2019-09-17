const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //installed via npm
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        library: 'libsimba',
        filename: 'libsimba.js',
        libraryTarget: 'umd',
        path: buildPath
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    "presets": [
                        [
                            "@babel/preset-env",
                            {
                                "useBuiltIns": "usage",
                                "corejs": "3.0.0"
                            }
                        ]
                    ],
                    "plugins": [
                        "@babel/plugin-transform-proto-to-assign",
                        ["@babel/plugin-transform-classes", {
                            "loose": true
                        }]
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            // Inject the js bundle at the end of the body of the given template
            inject: 'body',
            minify: false
        }),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled'
        }),
        new CopyPlugin([
            'package.json',
            'README.md',
            'CHANGELOG.md',
            'LICENSE',
            '.gitignore'
        ])
    ]
};

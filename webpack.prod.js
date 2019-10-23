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
        path: buildPath,
        globalObject: 'this'
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/example.html',
            filename: 'example.html',
            // Inject the js bundle at the end of the body of the given template
            inject: 'body',
            minify: false
        }),
        new HtmlWebpackPlugin({
            template: './src/example.ie11.html',
            filename: 'example.ie11.html',
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
            '.npmrc',
            '.gitignore'
        ])
    ]
};

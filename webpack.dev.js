const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: './src/index.js',
    devServer: {
        port: 8080,
        contentBase: path.join(__dirname, "dist")
    },
    node: {
        fs: 'empty'
    },
    output: {
        library: 'libsimba',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/example.html',
            inject: 'body',
            minify: false
        }),
        new HtmlWebpackPlugin({
            template: './src/example.ie11.html',
            filename: 'example.ie11.html',
            inject: 'head',
            minify: false
        })
    ]
};

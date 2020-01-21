const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //installed via npm

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: ["core-js/stable", "regenerator-runtime/runtime", './src/index.js'],
    devServer: {
        port: 8080,
        contentBase: path.join(__dirname, "dist")
    },
    optimization: {
        minimize: false
    },
    resolve: {
        mainFields: ['browser', 'main', 'module']
    },
    node: {
        fs: 'empty'
    },
    output: {
        path: `${__dirname}/dist`,
        library: 'libsimba',
        filename: 'libsimba.js',
        libraryTarget: 'umd',
        globalObject: '(typeof self !== \'undefined\' ? self : this)' // TODO Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true,
                    },
                }
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

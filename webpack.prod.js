const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');

const banner = `${pkg.name}
${pkg.description}\n
@version v${pkg.version}
@author ${pkg.author}
@homepage ${pkg.homepage}
@repository ${pkg.repository.url}`;

const umd = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: `${__dirname}/dist`,
        library: 'libsimba',
        filename: 'libsimba.min.js',
        libraryTarget: 'umd',
        globalObject: '(typeof self !== \'undefined\' ? self : this)' // TODO Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
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
        new webpack.BannerPlugin(banner)
    ]
};

const umdMinified = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: `${__dirname}/dist`,
        library: 'libsimba',
        filename: 'libsimba.js',
        libraryTarget: 'umd',
        globalObject: '(typeof self !== \'undefined\' ? self : this)' // TODO Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
    },
    optimization: {
        minimize: false
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
        new webpack.BannerPlugin(banner),
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
        })
    ]
};

const commonjs = {
    target: 'node',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: `${__dirname}/lib`,
        library: 'libsimba',
        filename: 'libsimba.js',
        libraryTarget: 'commonjs2',
        globalObject: '(typeof self !== \'undefined\' ? self : this)', // TODO Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
        umdNamedDefine: true
    },
    optimization: {
        minimize: false
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
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

module.exports = [commonjs, umd, umdMinified];

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
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/example.html',
            inject: 'body',
            minify: false
        })
    ]
};

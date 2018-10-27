const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './test/client',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
        ],
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'test/index.html'
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build'),
    },
    devServer: {}
};
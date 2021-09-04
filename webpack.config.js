const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    devServer: {
        static: {
            directory: './dist/' 
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed)
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin()
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
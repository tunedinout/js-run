const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    // entry point is set at the time of script start
    output: {
        path: path.resolve(__dirname,  'public'),
        filename: "bundle.js",
    },
    // content base from user
    devServer: {
        static: {
            directory:  path.join(__dirname, 'public'),
            watch: true,
        },
        hot: 'only',
        port: 3001,
        client: {
            reconnect: true,
          },
    },
    stats: 'minimal',
    plugins: [
    ]
}
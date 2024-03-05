const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    // entry: './.js',/
    // useful when one builds
    // TODO: if we ever support building files, but mostly wont
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
    // resolve: {
    //     alias: {
    //       src:  path.join(__dirname, 'public'),
    //     },
    //   },
    plugins: [
        // TODO: insert this dynamically
        // new HtmlWebpackPlugin({
        //     // what about this ???
        //     // content base and html file nam
        //     template: './public/index.html',
        //     filename: 'index.html'
        // })
    ]
}
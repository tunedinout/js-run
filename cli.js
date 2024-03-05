#!/usr/bin/env node

const { program } = require("commander");
const path = require("path");
// REMOVE
// const {
//   startServer,
//   injectCodeIntoHtml,
//   removeInjectedCode,
// } = require("./util");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js");
// TODO: if we ever allow user to build enable this, mostly not happening
// const HtmlWebpackPlugin = require("html-webpack-plugin");

program
  .option("-d, --directory <dir>", "Directory to host files from")
  .option("-h, --html <filename>", "name of the html file to host")
  .option("-p, --port <port>", "PORT on which to host the dev server", parseInt)
  .option("-e, --entry <entry-js-file>", "top level js file included in the html")
  .action(function () {
    const directory = this.opts().directory || "public";
    const htmlFileName = this.opts().html || "index.html";
    const port = this.opts().port || 3001;
    const entry = this.opts().entry || 'index.js';
    console.log(`directory = ${directory}`);
    console.log(`html = ${htmlFileName}`);
    console.log(`port = ${port}`);
    console.log(`entry = ${entry}`)
    if(!path.isAbsolute(directory)){
      directory = path.join(__dirname, directory);
    }
    webpackConfig.output.path = `${directory}/dist`;
    webpackConfig.output.filename = entry;
    webpackConfig.devServer.static.directory = directory;
    webpackConfig.entry = `${ webpackConfig.devServer.static.directory}/${entry}`;
    webpackConfig.devServer.port = port;
    // not needed as pointed out in the running dev server
    // webpackConfig.plugins = [
    //   new webpack.HotModuleReplacementPlugin()
    // ]

    // set entry point file

    const compiler = webpack(webpackConfig);
    const server = new webpackDevServer({...webpackConfig.devServer}, compiler);

    const runServer = async () => {
      console.log("The webpack final config", webpackConfig)
      console.log("server starting....");
      await server.start();
    };

    // program.action((a, b, c) => {
    //   console.log(`a=${a}, b = ${b}, c = ${c}`);
    // })

    runServer();

    
  });

program.parse(process.argv);

// const directory = program.directory || "public";
// const htmlFileName = program.html || "index.html";
// const port = program.port || 3001;

// console.log(`the port is + ${port} + directory = ${program.directory}`);

// webpackConfig.devServer.static.directory = path.join(__dirname, directory);
// webpackConfig.devServer.port = port;
// console.log(webpackConfig);
// webpackConfig.resolve.alias.src =  path.join(__dirname, directory);;
// HTML webpack plugin
// TODO: if we ever allow user to build enable this
// webpackConfig.plugins = [...webpackConfig.plugins, new HtmlWebpackPlugin({
//   template: `/${directory}/${htmlFileName}`,
//   filename: `${htmlFileName}`
// })]

// REMOVE
// program
//   // in this way we can take multiple space seperated
//   // arguments from the user
//   .command("serve [dir] [port] [<html-file-path>]")
//   .action((dir, port, htmlFileName) => {
//     // dir is either a relative path or an absolute path
//     // if its relative then it is w.r.t to __dirname
//     startServer(port, dir, htmlFileName);
//     // inject code for socket io
//     // with the given html file
//     // TODO: operating system dependent
//     //    const absolutePath = path.join(__dirname, dir, htmlFileName)
//     console.log("0." + dir + "/" + htmlFileName);
//     !path.isAbsolute(dir) && (dir = path.join(__dirname, dir));
//     const joinedPathWithFileName = path.join(dir, htmlFileName);
//     injectCodeIntoHtml(joinedPathWithFileName);
//     const cleanupCb = () => {
//         try {
//             removeInjectedCode(joinedPathWithFileName);
//             process.exit(0)
//         } catch (error) {
//             console.error("Error during cleanup:", error);
//             process.exit(1)
//         }

//     }
//     process.on("SIGINT", cleanupCb );
//     process.on("exit", cleanupCb)
//     // should run when user closes the cli app
//   });

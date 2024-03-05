#!/usr/bin/env node

const { program } = require("commander");
const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js");


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


    const compiler = webpack(webpackConfig);
    const server = new webpackDevServer({...webpackConfig.devServer}, compiler);

    const runServer = async () => {
      console.log("The webpack final config", webpackConfig)
      console.log("server starting....");
      await server.start();
    };
    runServer();

    
  });

program.parse(process.argv);
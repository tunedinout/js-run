#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");
const {
  startServer,
  injectCodeIntoHtml,
  removeInjectedCode,
} = require("./util");
const program = new Command();

program

  // in this way we can take multiple space seperated
  // arguments from the user
  .command("serve [dir] [port] [<html-file-path>]")
  .action((dir, port, htmlFileName) => {
    // dir is either a relative path or an absolute path
    // if its relative then it is w.r.t to __dirname
    startServer(port, dir, htmlFileName);
    // inject code for socket io
    // with the given html file
    // TODO: operating system dependent
    //    const absolutePath = path.join(__dirname, dir, htmlFileName)
    console.log("0." + dir + "/" + htmlFileName);
    !path.isAbsolute(dir) && (dir = path.join(__dirname, dir));
    const joinedPathWithFileName = path.join(dir, htmlFileName);
    injectCodeIntoHtml(joinedPathWithFileName);
    const cleanupCb = () => {
        try {
            removeInjectedCode(joinedPathWithFileName);
            process.exit(0)
        } catch (error) {
            console.error("Error during cleanup:", error);
            process.exit(1)
        }
      
    }
    process.on("SIGINT", cleanupCb );
    process.on("exit", cleanupCb)
    // should run when user closes the cli app
  });

program.parse(process.argv);

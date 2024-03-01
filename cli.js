#!/usr/bin/env node

const { Command } = require('commander');
const { startServer } = require('./api');
const program = new Command();

program

// in this way we can take multiple space seperated
// arguments from the user
    .command('serve [dir] [port]')
    .action((dir,port) => {
       startServer(port,dir)
    })


program.parse(process.argv)
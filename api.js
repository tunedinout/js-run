const express = require("express");
const chokidar = require("chokidar");
const path = require("path");
const socket_io = require('socket.io')

const PORT = 3001;
// let app;

exports.startServer =  function (PORT, directory) {
  let app = express();

  // tell express to serve static content
  // to host static files
  app.use(express.static(path.join(__dirname, directory)));

  let server = app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
  });

  app.get('/', (request, response) => {
    // response.writeHead(200, {'Content-Type': 'text/html'})
    console.log(__dirname)
    // response.setHeader('Content-Type', 'text/html').sendFile(path.join(__dirname, './index.html'))
    response.sendFile(path.join(__dirname, directory, 'index.html'));
  })

  // watcher
  const watcher = chokidar.watch(`./${directory}`, {
    ignored: /[\/\\]\./, // ignore dotfiles
    persistent: true,
  });

  // On file change, broadcast message to WebSocket clients
  watcher.on("change", (path) => {
    console.log(`File ${path} has been changed`);
    server.emit('file-changed')
    // websocketServer.broadcast("File change detected. Refresh to see updates.");
    // Some times chat gpt looses it
    // Object.keys(require.cache).forEach(function(key) {
    //   delete require.cache[key];
    // });
    // server.close(() => {
    //   console.log("server restarting.....")
    //   // setTimeout(() => {
    //   //   startServer()
    //   // })
    //   // startServer();
    // })

  });
  const io = socket_io(server);
  io.on('connection', (socket) => {
    console.log('A client connected');
  
    // When a client connects, listen for file change events and send a reload signal
    server.on('file-changed', () => {
      socket.emit('reload');
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

// startServer(PORT, "public");



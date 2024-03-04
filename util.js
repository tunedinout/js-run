const express = require("express");
const chokidar = require("chokidar");
const path = require("path");
const socket_io = require("socket.io");
const fs = require("fs");

const PORT = 3001;
// let app;

exports.startServer = function (PORT, directory, htmlFileName) {
  let app = express();
  !path.isAbsolute(directory) && (directory = path.join(__dirname, directory));

  app.use(express.static(directory));

  let server = app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
  });

  app.get("/", (request, response) => {
    response.sendFile(path.join(directory, htmlFileName));
  });

  // watcher
  const watcher = chokidar.watch(`${directory}`, {
    ignored: /[\/\\]\./, // ignore dotfiles
    persistent: true,
  });

  // On file change, broadcast message to WebSocket clients
  watcher.on("change", (path) => {
    console.log(`File ${path} has been changed`);
    server.emit("file-changed");
  });

  const io = socket_io(server);
  io.on("connection", (socket) => {
    console.log("A client connected");

    // When a client connects, listen for file change events and send a reload signal
    server.on("file-changed", () => {
      socket.emit("reload");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

exports.injectCodeIntoHtml = function (filepath) {
  console.log("1", filepath);
  let htmlContent = fs.readFileSync(filepath, "utf-8");
  const headStartIndex = htmlContent.indexOf("<head>");
  const headEndIndex = htmlContent.indexOf("</head>", headStartIndex);

  if (headStartIndex !== -1 && headEndIndex !== -1) {
    const codeInjection = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js"></script>
    <script>
      const socket = io();
      socket.on('reload', () => {
        console.log('Reloading...');
        window.location.reload();
      });
    </script>`;
    if (!htmlContent.includes(codeInjection))
      htmlContent =
        htmlContent.slice(0, headEndIndex) +
        codeInjection +
        htmlContent.slice(headEndIndex);
  } else {
    headStartIndex == -1 && console.error("<head> tag missing from html file");
    headEndIndex == -1 && console.error("</head> tag missing from html file");
  }
  // find the head of

  fs.writeFileSync(filepath, htmlContent, "utf-8");
};

exports.backupHTMLFile = function (filepath) {
  const backupFilepath = filepath + ".bak";
  fs.copyFileSync(filepath, backupFilepath);
};

exports.restoreOrginalHTMLfile = function (htmlFilePath) {
  const backupFilepath = htmlFilePath + ".bak";
  // remove .bak extension from backwards
  const originalFilePath = backupFilepath.slice(0, -4);

  // remove existing html file
  fs.existsSync(originalFilePath) && fs.unlinkSync(originalFilePath);
  // restore original file
  fs.renameSync(htmlFilePath, originalFilePath);

  // remove the injecte
};

exports.removeInjectedCode = function (filepath) {
  let htmlContent = fs.readFileSync(filepath, "utf-8");
  const codeInjection = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js"></script>
    <script>
      const socket = io();
      socket.on('reload', () => {
        console.log('Reloading...');
        window.location.reload();
      });
    </script>`;
  // empty out
  htmlContent = htmlContent.replace(codeInjection, "");
  fs.writeFileSync(filepath, htmlContent, "utf-8");
}
// startServer(PORT, "public");

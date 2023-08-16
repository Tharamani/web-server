const { createResponse } = require("../response/response");
const path = require("path");
const fs = require("fs");
const PUBLIC_DIR = path.join(__dirname, "../public", "/");
// const PUBLIC_DIR = path.join(__dirname, "../dist", "/");

// The Request Handler
const manageRequestHandler = (req, res, get) => {
  const method = req.method;

  //  "/" => return index file path
  if (req.path === "/") req.path = path.join(PUBLIC_DIR, "index.html");
  if (fs.existsSync(req.path)) return res.send(req.path);

  //  "/about" => execute the handler function to display about.html file
  if (method === "GET" && get.path.includes(req.path)) {
    const handlerIndex = get.path.indexOf(req.path);
    get.handler[handlerIndex](req, res);
  }

  // otherwise send the file that matches path
  if (fs.existsSync(path.join(PUBLIC_DIR, req.path)))
    res.send(path.join(PUBLIC_DIR, req.path));
};

// socket to conn
const handleRequest = (req, res, socket, get, root) => {
  // This function will handle all the request
  res.write = (response) => {
    console.log("res", response);
    const rs = createResponse(200, "OK", response, getContentType(response));
    socket.write(rs);
    socket.write(response);
  };

  // object
  const getContentType = (fileName) => {
    switch (fileName.split(".").pop()) {
      case "html":
        return "text/html";
      case "css":
        return "text/css";
      case "js":
        return "text/javascript";
      case "png":
        return "image/png";
      case "jpg":
        return "image/jpeg";
      case "svg":
        return "image/svg+xml";
      default:
        return "application/octet-stream";
    }
  };

  res.send = (pathOfFile) => {
    const contentType = getContentType(pathOfFile);
    console.log(" RES SEND FILE", pathOfFile, contentType);

    fs.readFile(pathOfFile, (err, data) => {
      if (err) {
        socket.write(404, { "Content-Type": "text/plain" });
        socket.end("404 Not Found");
      } else {
        const rs = createResponse(200, "OK", data, contentType);
        socket.write(rs);
        socket.write(data);
      }
    });
  };

  manageRequestHandler(req, res, get, root);
};

module.exports = { handleRequest };

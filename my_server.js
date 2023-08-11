const net = require("net");
const { requestparser } = require("./request/requestparser");
const { createResponse } = require("./response/response");
const URL = require("url");
const fs = require("fs");
const path = require("path");
const PUBLIC_DIR = path.join(__dirname, "public", "/");

const my_server = () => {
  const app = {};
  const get = {
    handler: [],
    path: [],
  };

  app.get = (path, handler) => {
    get.handler.push(handler);

    get.path.push(path);
    console.log("GET OBJECT", get);
  };

  // The Request Handler
  function manageRequestHandler(req, res) {
    console.log("manageRequestHandler PUBLIC_DIR", PUBLIC_DIR);

    const method = req.method;
    const url = req.path;
    console.log("manageRequestHandler req.path", req.path);
    console.log("manageRequestHandler url", url);

    // req.path === "/"
    //   ? (req.path = path.join(PUBLIC_DIR, "index.html"))
    //   : (req.path = path.join(PUBLIC_DIR, req.path));
    // if (fs.existsSync(req.path)) res.sendFile(req.path);

    if (req.path === "/") req.path = path.join(PUBLIC_DIR, "index.html");
    if (fs.existsSync(req.path)) return res.sendFile(req.path);

    const parsedUrl = URL.parse(url);
    console.log("manageRequestHandler parsedUrl", parsedUrl);

    if (method === "GET" && get.path.includes(parsedUrl.pathname)) {
      const handlerIndex = get.path.indexOf(parsedUrl.pathname);
      console.log("manageRequestHandler handlerIndex", handlerIndex);
      get.handler[handlerIndex](req, res);
    }
    // else {
    const pathParams = path.join(PUBLIC_DIR, parsedUrl.pathname);
    console.log("manageRequestHandler parsedUrl ELSE", pathParams);

    if (fs.existsSync(pathParams)) res.sendFile(pathParams);
    // }
  }

  const handleRequest = (req, res, socket) => {
    // This function will handle all the request
    res.send = (response) => {
      const rs = createResponse(200, "OK", response, response["content-type"]);
      socket.write(rs);
      socket.write(response);
    };

    function getContentType(fileName) {
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
        default:
          return "application/octet-stream";
      }
    }

    res.sendFile = (pathOfFile) => {
      const contentType = getContentType(pathOfFile);
      console.log(" RES SEND FILE", pathOfFile, contentType);

      fs.readFile(pathOfFile, (err, data) => {
        if (err) {
          socket.write(404, { "Content-Type": "text/plain" });
          socket.end("404 Not Found");
        } else {
          // console.log("TRES SEND FILE", data);
          const rs = createResponse(200, "OK", data, contentType);
          socket.write(rs);
          socket.write(data);
        }
      });
    };

    manageRequestHandler(req, res);
  };

  const handleConnection = (socket) => {
    console.log("connected");

    let data = Buffer.from("");

    socket.on("data", (buffer) => {
      console.log("data", buffer);

      // Concatenate existing request buffer with new data
      data = Buffer.concat([data, buffer]);

      let marker = data.indexOf("\r\n\r\n");

      if (marker !== -1) {
        // If we reached \r\n\r\n, there could be data after it.
        const body = data.subarray(marker + 4).toString();

        // The header is everything we read, up to and not including \r\n\r\n
        const reqHeader = data.subarray(0, marker).toString();
        const request = requestparser(reqHeader, body);
        console.log("REQUEST", request);
        const response = {};
        handleRequest(request, response, socket);
      }
    });
  };

  app.listen = (port, callback) => {
    const server = net.createServer(handleConnection);

    server.listen(port, (err) => {
      callback(err);
    });
  };

  return app;
};

module.exports = { my_server };

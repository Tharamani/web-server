const net = require("net");
const { requestParser } = require("./request/requestParser");
const handleRequest = require("./request/requestHandler");

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

  const handleConnection = (c) => {
    console.log("connected");

    let data = Buffer.from("");

    c.on("data", (buffer) => {
      // Concatenate existing request buffer with new data
      data = Buffer.concat([data, buffer]);

      let marker = data.indexOf("\r\n\r\n");

      if (marker !== -1) {
        // If we reached \r\n\r\n, there could be data after it.
        const body = data.subarray(marker + 4).toString();

        // The header is everything we read, up to and not including \r\n\r\n
        const reqHeader = data.subarray(0, marker).toString();
        const request = requestParser(reqHeader, body);
        const response = {};
        handleRequest.handleRequest(request, response, c, get);
      }
    });

    // wait till end and the parse
    c.on("end", () => {
      console.log("client disconnected");
    });
  };

  app.listen = (port, callback) => {
    // Creates a new TCP or IPC server.
    const server = net.createServer(handleConnection);

    server.on("error", (err) => {
      throw err;
    });
    // listens for connections
    server.listen(port, (err) => {
      callback(err);
    });
  };

  return app;
};

module.exports = { my_server };

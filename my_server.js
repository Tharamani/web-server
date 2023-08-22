const net = require("net");
const { requestParser } = require("./request/requestParser");
const hRequest = require("./request/requestHandler");

// carriage return and line feed
const CRLF = "\r\n\r\n";

const my_server = () => {
  const app = {};
  const routes = {};
  let STATIC = "";

  app.getRoutes = () => {
    return routes;
  };

  //don't use routes
  app.static = (root) => {
    STATIC = root;
  };

  const addRoute = (method, path, handler) => {
    // if (!handler) routes[method] = path;

    if (!routes[method]) {
      routes[method] = {};
    }
    routes[method][path] = handler;
  };

  app.get = (path, handler) => {
    addRoute("GET", path, handler);
  };

  app.post = (path, handler) => {
    addRoute("POST", path, handler);
  };

  app.put = (path, handler) => {
    addRoute("PUT", path, handler);
  };

  app.delete = (path, handler) => {
    addRoute("DELETE", path, handler);
  };

  const handleConnection = (connection) => {
    console.log("connected");

    let data = Buffer.from("");

    connection.on("data", (buffer) => {
      // Concatenate existing request buffer with new data
      data = Buffer.concat([data, buffer]);

      let marker = data.indexOf(CRLF);

      if (marker !== -1) {
        // If we reached \r\n\r\n, there could be data after it.
        const body = data.subarray(marker + CRLF.length).toString();

        // The header is everything we read, up to and not including \r\n\r\n
        const reqHeader = data.subarray(0, marker).toString();
        const request = requestParser(reqHeader, body);

        const response = {};
        hRequest.handleRequest(request, response, connection, routes, STATIC);
      }
    });

    // wait till end and the parse
    connection.on("end", () => {
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

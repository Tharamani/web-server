const { createResponse } = require("../response/response");
const staticHandler = require("../handlers/staticHandler");
const routeHandler = require("../handlers/routeHandler");
const fs = require("fs");
var mime = require("mime-types");
const notFoundHandler = require("../handlers/notfoundHandler");

const DIR = "public";
// const DIR = "dist";

const handler = [staticHandler, routeHandler, notFoundHandler];
// The Request Handler
const manageRequestHandler = async (req, res, routes, STATIC) => {
  for (let index = 0; index < handler.length; index++) {
    const element = handler[index];
    if (await element(req, res, routes, STATIC)) break;
  }
};

const handleRequest = (req, res, connection, routes, STATIC) => {
  // This function will handle all the request
  res.headers = {};
  res.statusText = res.statusText ? res.statusText : "OK";
  res.statusCode = res.statusCode ? res.statusCode : 200;
  res.headers["Content-Type"] ? res.headers["Content-Type"] : "text/plain";

  res.send = (filePath) => {
    const mime_type = mime.lookup(filePath);
    console.log("filePath : mime_type: isHandled", filePath, mime_type);

    // if file
    if (mime_type) {
      return fs.readFile(filePath, (err, data) => {
        if (err) {
          return notFoundHandler(req, res);
        } else {
          res.statusText;
          const rs = createResponse(
            res.statusCode,
            res.statusText,
            data,
            mime_type
          );
          connection.write(rs);
          connection.write(data);
        }
      });
    }

    const rs = createResponse(
      res.statusCode,
      res.statusText,
      filePath,
      res.headers["Content-Type"]
    );
    connection.write(rs);
    connection.write(filePath);
  };

  manageRequestHandler(req, res, routes, STATIC);
};

module.exports = { handleRequest };

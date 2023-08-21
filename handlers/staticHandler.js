const path = require("path");
const fs = require("fs");
const notFoundHandler = require("../handlers/notfoundHandler");

const staticHandler = (req, res, routes) => {
  console.log("staticHandler req", req);
  if (req.path === "/") {
    if (req.method !== "GET") return notFoundHandler(req, res);

    req.path = path.join(routes.STATIC, `${req.path}index.html`);
    if (fs.existsSync(req.path)) return res.send(req.path);
  }

  // async handling
  if (fs.existsSync(path.join(routes.STATIC, req.path)))
    return res.send(path.join(routes.STATIC, req.path));

  if (!routes[req.method][req.path]) return notFoundHandler(req, res);
};

module.exports = staticHandler;

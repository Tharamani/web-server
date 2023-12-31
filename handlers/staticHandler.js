const path = require("path");
const fs = require("fs");
const fsExists = require("fs.promises.exists");

const staticHandler = async (req, res, routes, STATIC) => {
  if (req.path === "/") {
    if (req.method === "GET") {
      const rPath = path.join(STATIC, `${req.path}index.html`);

      if (await fsExists(rPath)) {
        res.send(rPath);
        return true;
      }
      return false;
    }
    return false;
  }

  // async handling
  if (await fsExists(path.join(STATIC, req.path))) {
    res.send(path.join(STATIC, req.path));
    return true;
  }
  return false;
};

module.exports = staticHandler;

const routeHandler = async (req, res, routes, STATIC) => {
  // console.log("routeHandler routes", routes);
  console.log("routeHandler req", req);
  if (routes[req.method][req.path]) {
    routes[req.method][req.path](req, res);
    return true;
  }
  return false;
};

module.exports = routeHandler;

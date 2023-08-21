const routeHandler = (req, res, routes) => {
  console.log("routeHandler routes", routes);
  console.log("routeHandler req", req);
  if (routes[req.method][req.path])
    return routes[req.method][req.path](req, res);
};

module.exports = routeHandler;

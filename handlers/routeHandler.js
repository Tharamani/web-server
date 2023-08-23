const findRouteHandler = (req, routes) => {
  const methodRoutes = routes[req.method];

  if (methodRoutes) {
    for (const routePattern in methodRoutes) {
      const routeRegex = new RegExp(`^${routePattern}$`);
      const match = req.path.match(routeRegex);

      if (match) {
        return methodRoutes[routePattern].handler;
      }
    }
  }
  return null;
};

const routeHandler = async (req, res, routes, STATIC) => {
  const rHandler = findRouteHandler(req, routes);
  if (rHandler) {
    rHandler(req, res);
    return true;
  }
  return false;
};

module.exports = routeHandler;

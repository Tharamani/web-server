const notFoundHandler = async (req, res, routes, STATIC) => {
  res.headers["Content-Type"] = "text/plain";
  res.statusCode = 404;
  res.statusText = "Not Found";
  res.send("Not Found");
};

module.exports = notFoundHandler;

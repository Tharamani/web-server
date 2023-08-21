const parse = require("./parser");

const requestParser = (reqHeader, body) => {
  let request;

  // use const vars
  const parsedRL = parse.requestLine(reqHeader); // RL

  if (parsedRL[0] === null) return null;

  //destructure
  const [req, headerBodyStr] = parsedRL;
  request = req;

  // use const vars
  const parsedHeaders = parse.headers(headerBodyStr); // Headers

  if (parsedHeaders[0] === null) return null;
  const [reqHeaders, bodyStr] = parsedHeaders;
  request.headers = reqHeaders;

  const parsedBody = parse.body(body, request.headers["content-length"]); // body

  if (parsedBody[0] !== null) request.body = parsedBody[0];

  // send object with all 3 data
  return request;
};

module.exports = { requestParser };

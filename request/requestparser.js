const parse = require("./parser");

const requestparser = (reqHeader, body) => {
  let request;

  let parsed = parse.requestLine(reqHeader); // RL
  // console.log("requestLine parse RL : ", parsed);
  if (parsed[0] === null) return null;
  request = parsed[0];

  parsed = parse.headers(parsed[1]); // Headers
  // console.log("headers parse Headers: ", parsed);

  if (parsed[0] === null) return null;
  request.headers = parsed[0];

  // console.log("body parse before body : ", body);
  parsed = parse.body(body, request.headers); // body
  // console.log("body parse after body : ", parsed[1]);

  if (parsed[0] !== null) request.body = parsed[0];

  return request;
};

module.exports = { requestparser };

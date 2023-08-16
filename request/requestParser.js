const parse = require("./parser");

const requestParser = (reqHeader, body) => {
  let request;

  // use const vars
  let parsed = parse.requestLine(reqHeader); // RL
  // console.log("requestLine parse RL : ", parsed);
  if (parsed[0] === null) return null;
  //destructure
  request = parsed[0];

  // use const vars
  parsed = parse.headers(parsed[1]); // Headers
  // console.log("headers parse Headers: ", parsed);

  if (parsed[0] === null) return null;
  request.headers = parsed[0];

  // use const vars
  //  send cl as params
  parsed = parse.body(body, request.headers); // body
  // console.log("body parse after body : ", parsed[1]);

  if (parsed[0] !== null) request.body = parsed[0];

  // send object with all 3 data
  return request;
};

module.exports = { requestParser };

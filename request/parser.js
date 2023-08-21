const CRLF = "\r\n";

const requestLine = (reqHeaders) => {
  const reqLine = reqHeaders.split(CRLF);
  const [method, path, protocol] = reqLine[0].split(" ");

  return [
    { method, path, protocol },
    reqHeaders.slice(reqLine[0].length + CRLF.length),
  ];
};

const headers = (reqHeaders) => {
  const headers = {};
  reqHeaders.split(CRLF).forEach((line) => {
    let [key, value] = line.trim().split(": ");
    headers[key.toLowerCase().trim()] = value.trim();
  });

  return [headers, reqHeaders.slice(reqHeaders.length)]; //
};

// send cl as params
const body = (reqBody, contentLength) => {
  let requestBody = "";

  if (contentLength === undefined) return [null, reqBody.slice(0)];

  const cLength = parseInt(contentLength);

  requestBody = reqBody.slice(0, cLength);
  return [requestBody, reqBody.slice(cLength)];
};

module.exports = { requestLine, headers, body };

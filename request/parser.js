const requestLine = (reqHeaders) => {
  const reqLine = reqHeaders.split("\r\n");
  const [method, path, protocol] = reqLine[0].split(" ");

  return [{ method, path, protocol }, reqHeaders.slice(reqLine[0].length + 2)];
};

const headers = (reqHeaders) => {
  // console.log("parseHeaders: reqHeaders ", reqHeaders.length);
  const headers = {};
  reqHeaders.split("\r\n").forEach((line) => {
    let [key, value] = line.trim().split(": ");
    headers[key.toLowerCase().trim()] = value.trim();
  });
  // console.log("parseHeaders: reqHeaders ", reqHeaders.length);

  return [headers, reqHeaders.slice(reqHeaders.length)]; //
};

const body = (reqBody, headers) => {
  let requestBody = "";

  if (headers["content-length"] === undefined) return [null, reqBody.slice(0)];

  const cLength = parseInt(headers["content-length"]);

  requestBody = reqBody.slice(0, cLength);
  return [requestBody, reqBody.slice(cLength)];
};

module.exports = { requestLine, headers, body };

// responseHeaders
const createResponse = (statusCode, statusText, body, contentType) => {
  const headers = [
    `HTTP/1.0 ${statusCode} ${statusText}`,
    `Content-Type: ${contentType}`,
    `Content-Length: ${body ? Buffer.byteLength(body) : 0}`,
    "", // Empty line to separate headers from the body
  ];

  return headers.join("\r\n") + "\r\n";
};

module.exports = { createResponse };

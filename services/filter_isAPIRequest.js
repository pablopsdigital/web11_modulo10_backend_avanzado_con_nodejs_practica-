"use strict";

function filter_isAPIRequest(req) {
  return req.originalUrl.startsWith("/api/");
}

module.exports = filter_isAPIRequest;

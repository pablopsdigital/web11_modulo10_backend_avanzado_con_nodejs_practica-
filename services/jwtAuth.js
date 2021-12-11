'use strict';
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //Read token
  const jwtToken =
    req.get('Authorization') || req.query.token || req.body.token;

  //Check have a token
  if (!jwtToken) {
    const error = new Error('No token provider');
    error.status = 401;
    next(error);
    return;
  }

  //Check validation token
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
    //If no valid token
    if (err) {
      err.message = 'Invalid token';
      err.status = 401;
      next(err);
      return;
    }

    //If valid token
    req.apiAuthUserId = payload._id;
    next();
  });
};

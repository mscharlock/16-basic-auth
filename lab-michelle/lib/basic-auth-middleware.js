'use strict';

const debug = require('debug')('cfgram:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('basic auth');

  //get the headers, look for authentication
  let authHeaders = req.headers.authorization;
  //if no headers, error//
  if(!authHeaders) return next(new Error('authorization failed, auth headers required'));

  //parse the username/password from base64 into useable pieces
  let base64Str = authHeaders.split('Basic ')[1];
  if(!base64Str) return next(new Error('authorization failed, username:password required'));

  //assemble pieces from Buffer
  let [username, password] = Buffer.from(base64Str, 'base64').toString().split(':');

  //this gives us the unhashed and actual data?
  req.auth = { username, password };

  if(!req.auth.username) return next(new Error('authorization failed, username required'));
  if(!req.auth.password) return next(new Error('authorization failed, password required'));

  next();
};

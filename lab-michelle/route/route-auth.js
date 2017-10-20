'use strict';

const debug = require('debug')('cfgram:route-auth');
const errorHandler = require('../lib/error-handler');
const basicAuth = require('../lib/basic-auth-middleware');
const User = require('../model/user');

module.exports = function(router) {

  //our post method for /signup
  router.post('/api/signup', (req, res) => {
    debug('POST /api/signup');
    //get rid of password before req is handed back. Security
    let pw = req.body.password;
    delete req.body.passsword;

    //instantiate a new user using the info from req.body
    let user = new User(req.body);

    //generate a password hash, then save the user, generate a token, make a 201 res status when you send the token along and handle any errors
    user.generatePasswordHash(pw)
      .then(user => user.save())
      .then(user => user.generateToken())
      .then(token => res.status(201).send(token))
      .catch(err => errorHandler(err, req, res));
  });

  //Get method on /signin. Run req through basicAuth, then return a user that has the same username, compare the password hashes, generate a token, send the token, and/or catch an error
  router.get('/api/signin', basicAuth, (req, res) => {
    debug('GET /api/signin');

    return User.findOne({username: req.auth.username})
      .then(user => user.comparePasswordHash(req.auth.password))
      .then(user => user.generateToken())
      .then(token => res.send(token))
      .catch(err => errorHandler(err, req, res));
  });
};

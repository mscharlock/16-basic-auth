'use strict';

//req dependencies
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//Mongoose Schema that sets up how we make users
const User = mongoose.Schema({
  username: { type: String, require: true, unique: true},
  password: {type: String, require: true},
  email: {type: String, require: true},
  findHash: {type: String, unique: true},
});

//Makes a hashed password (so no plain text)
User.methods.generatePasswordHash = function(password) {

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

//compares user's password with the one stored in the db (which has been hashed?)
User.methods.comparePasswordHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('authorization failed, password did not match'));
      resolve(this);
    });
  });
};

//Hash of hash creates a token
User.methods.generateFindHash = function() {

  return new Promise((resolve, reject) => {
    let tries = 0;
    //grabbing the context of user

  //helper function which converts findhash on a user into 32 bit hex, which we save into user's info on Mongo, then we resolve our promise to generate a findhash by attempting to generate this hash 3 times. If it doesn't work, throw an error.
  function _generateFindHash() {
    this.findhash = crypto.randomBytes(32).toString('hex');
    this.save()
    .then(() => resolve(this.findhash))
    .catch(err => {
      if(tries < 3) {
        tries++;
        _generateFindHash.call(this);
      }
      if (err) return reject(err);
    });
  }
};

//Creates a token using the findhash through json web token process, then does something with the APP_SECRET environment variable
User.methods.generateToken = function() {

  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findhash => resolve(jwt.sign({token: findhash}, process.env.APP_SECRET)))
    .catch(err => {
      console.error(err);
      reject(err);
    });
  });
};

//finally we export the model at the bottom of the page after everything is done
module.exports = mongoose.model('user', User);

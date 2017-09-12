'use strict';

const debug = require('debug')('cfgram:error-handler');

module.exports = function(err, req, res) {
  debug(`#error-handler: ${err.message}`);

  let msg = err.message.toLowerCase();

  switch(true) {
    //if the message includes "authorization failed" which all of ours do in our middleware, then we will return a 401 error
    case msg.includes('authorization failed'): return res.status(401).send(`${err.name}: ${err.message}`)
    msg.includes('validation failed'): return res.status(400).send(`${err.name}: ${err.message}`)
    msg.includes('duplicate key'): return res.status(409).send(`${err.name}: ${err.message}`)
    msg.includes('objectid failed'): return res.status(404).send(`${err.name}: ${err.message}`)
    default: return res.status(500).send(`${err.name}: ${err.message}`)
  };
};

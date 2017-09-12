'use strict';

const debug = require('debug')('cfgram:error-handler');

module.exports = function(err, req, res) {
  debug(`#error-handler: ${err.message}`);

  let msg = err.message.toLowerCase();

  switch(true) {
    case msg.includes('authorization failed'): return res.status(401).send(`${err.name}: ${err.message}`);
  }
}

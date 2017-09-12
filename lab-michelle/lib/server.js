'use strict';

const debug = require('debug')('cfgram:server');

//express
const express = require('express');
const router = express.Router();
const app = express();

//mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let wat = mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

//middleware for router
require('../route/route-auth')(router);

//mount middleware
app.use(require('body-parser').json());
app.use(require('cors')());
app.use(router);

//catch all for errors is our 404
app.all('/*', (req, res) => res.sendStatus(404));

const server = module.exports = {};

server.isOn = false;
//method of starting the server up - checks if it is on, then if it is not, starts listening for it and changes our flag to true for server.isOn
server.start = () => {
  return new Promise((resolve, reject) => {
    if(!server || !server.isOn) {
      server.http = app.listen(process.env.PORT, () => {
        debug(`Listening on ${process.env.PORT}`);
        server.isOn = true;
        resolve();
      });
      return;
    }
    reject(new Error('server already running'));
  });
};

//reverse of other method above
server.stop = () => {
  return new Promise((resolve, reject) => {
    if(server.http && server.isOn) {
      return server.http.close(() => {
        wat.close();
        server.isOn = false;
        resolve();
      });
    }
    reject(new Error('the server is not running'));
  });
};

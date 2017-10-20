'use strict';

const Gallery = require('../model/gallery');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('cfgram:route-gallery');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
  router.post('/api/gallery', bearerAuth, (req, res) => {
    debug('POST /api/gallery');
    req.body.userId = req.user._id;

    return new Gallery(req.body).save()
      .then(gallery => res.status(201).json(gallery))
      .catch(err => errorHandler(err, req, res));
  });

//GET ONE
  router.get('/api/gallery/:_id', bearerAuth, (req, res) => {
    debug('GET /api/gallery/:_id');

    return Gallery.findById(req.params._id)
      .then(gallery => res.json(gallery))
      .catch(err => errorHandler(err, req, res));
  });

//GET ALL
  router.get('/api/gallery', (req, res) => {
    //something in here
  });

  router.put('/api/gallery', (req, res) => {
    //something in here
  });

  router.delete('/api/gallery', (req, res) => {
    //something in here
  });
};

'use strict';

const getFBphoto = require('../helpers');
const dbHelpers = require('../../db/helpers');
const config = require('../../config');
const redisClient = require('redis-connection')();
const JWT = require('jsonwebtoken');

module.exports = (request, reply) => {
  /* istanbul ignore if */
  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed: ', request.auth.error.message);
  }
    /* istanbul ignore next */
  const profile = request.auth.credentials.profile;

  const session = {
    valid: true,
    id: profile.id,
    displayName: profile.displayName
  }
  /* istanbul ignore next */
  redisClient.set(session.id, JSON.stringify(session));
  const jwt = JWT.sign(session, config.sessionSecret);

  dbHelpers.findOne(profile.id)
    .then(result => {
      /* istanbul ignore if */
      if (result) {
        return reply.redirect('/rooms').state('token', jwt);
      } else {
        //create new user
        /* istanbul ignore next */
        getFBphoto(profile.id, request.auth.credentials.token, (error, photo) => {
          /* istanbul ignore next */
          dbHelpers.createNewUser(profile, request.auth.credentials.token, photo, (newUser) => {

            return reply.redirect('/rooms').state('token', jwt);
          });
        });
      }
    });
}

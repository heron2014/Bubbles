'use strict';

const getFBphoto = require('../helpers');
const dbHelpers = require('../../db/helpers');

module.exports = (request, reply) => {

  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed: ', request.auth.error.message);
  }

  const profile = request.auth.credentials.profile;

  request.cookieAuth.set({
    id: profile.id,
    displayName: profile.displayName
  });


  dbHelpers.findOne(profile.id)
    .then(result => {

      if (result) {
        return reply.redirect('/rooms');
      } else {
        //create new user
        getFBphoto(profile.id, request.auth.credentials.token, (error, photo) => {
          dbHelpers.createNewUser(profile, request.auth.credentials.token, photo, (newUser) => {

            return reply.redirect('/rooms');
          });
        });
      }
    });
}

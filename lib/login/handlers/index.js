'use strict';

module.exports = (request, reply) => {

  if (!request.auth.isAuthenticated) {
    return reply('Authentication failed: ', request.auth.error.message);
  }

  const profile = request.auth.credentials.profile;

  request.cookieAuth.set({
    id: profile.id,
    displayName: profile.displayName
  });

  return reply.redirect('/rooms');

}

'use strict';

const authHandler = require('./handlers');

exports.register = (server, options, next) => {

  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    config: {
      auth: 'facebook',
      handler: authHandler
    }
  });

  return next();
}

exports.register.attributes = {
  name: 'Login'
}

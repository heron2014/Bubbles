'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: false,
      handler: (request, reply) => {
        reply.view('login');
      }
    }

  });

  return next();
}

exports.register.attributes = {
  name: 'Home'
}

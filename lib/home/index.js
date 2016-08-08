'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: false
    },
    handler: (request, reply) => {
      return reply.view('home');
    }

  });

  return next();
}

exports.register.attributes = {
  name: 'Home'
}

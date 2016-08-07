'use strict';

/**
* Load all public assets, e.g js, css, images
*/

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/public/{params*}',
    config: {
      description: 'load assets',
      auth: false,
      handler: {
        directory: {
          path: 'public'
        }
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Assets'
};

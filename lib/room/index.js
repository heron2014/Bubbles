'use strict';
const dbHelpers = require('../db/helpers');
const config = require('../config');

exports.register = (server, options, next) => {

  server.route([
  {
    method: 'GET',
    path: '/rooms',
    config: {
      handler: (request, reply) => {
         /* istanbul ignore if*/
        if (!request.auth.isAuthenticated) {
          return reply.redirect('/');
        }

        dbHelpers.getAllRooms((err, rooms) => {
          dbHelpers.findOne(request.auth.credentials.id)
            .then(user => {
            reply.view('rooms', {rooms: rooms, user: user, host: config.host });
          });
        });
      }
    }
  },
  {
    method: 'GET',
    path: '/room/{title}',
    config: {
      handler: (request, reply) => {
        let title = encodeURIComponent(request.params.title);
        let getRoom = dbHelpers.getRoom(title, (err, room) => {
          if (room) {
            dbHelpers.findOne(request.auth.credentials.id)
              .then(user => {
                reply.view('room', {user: user, title: room.title, id: room.id, host: config.host});
              })
          } else {
            reply.redirect('/rooms');
          }
        });
      }
    }
  }]);

  return next();
}

exports.register.attributes = {
  name: 'Room'
}

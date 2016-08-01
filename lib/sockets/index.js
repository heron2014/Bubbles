'use strict';

const socketIO = require('socket.io');
const redisClient = require('redis-connection')();
const dbHelpers = require('../db/helpers');

exports.register = (server, options, next) => {

  const io = socketIO(server.listener);

  io.of('/roomslist').on('connection', (socket) => {
    server.app.allrooms = [];
    const allrooms = server.app.allrooms;

    socket.on('getChatRooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));

    });

    socket.on('createNewRoom', newRoomInput => {

      // check to see if a room with the same title exist or not
      // if not , create one and broadcast it to everyone
      if (!dbHelpers.findRoomByName(allrooms, newRoomInput)) {
        //create a new room and brodcast to all
        //perform database creation
        allrooms.push({
          id: dbHelpers.randomHex(),
          title: newRoomInput
        });
        //Emit an updated list to the creator
        socket.emit('chatRoomsList', JSON.stringify(allrooms));
        //emit an updated list to everyone connected to the rooms page
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms))
      }

    });
  });

  return next();
}

exports.register.attributes = {
	name: 'SocketsPlugin'
}

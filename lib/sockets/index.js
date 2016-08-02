'use strict';

const socketIO = require('socket.io');
const redisClient = require('redis-connection')();
const dbHelpers = require('../db/helpers');
const config = require('../config');

exports.register = (server, options, next) => {

  const io = socketIO(server.listener);
  io.of('/roomslist').on('connection', (socket) => {

    dbHelpers.getAllRooms((errR, rooms) => {
      socket.on('getChatRooms', () => {
        socket.emit('chatRoomsList', JSON.stringify(rooms));
      });

      socket.on('createNewRoom', newRoomInput => {
        // check to see if a room with the same title exist or not
        // if not , create one and broadcast it to everyone
        if (!dbHelpers.findRoomByName(rooms, newRoomInput)) {
          //create a new room and brodcast to all
          dbHelpers.createNewRoom(newRoomInput, (errRedis, responseRedis) => {
            if (errRedis) {
              next(errRedis)
            }
            //Emit an updated list to the creator
            socket.emit('chatRoomsList', JSON.stringify(rooms));
            //emit an updated list to everyone connected to the rooms page
            socket.broadcast.emit('chatRoomsList', JSON.stringify(rooms))
          });
        }

      });
    })
  });

  io.of('/chatter').on('connection', (socket) => {
    //join the chatrooms
    socket.on('join', data => {

      let token = dbHelpers.generateToken(socket.request.headers.cookie);
      let usersList = dbHelpers.addUserToRoom(data, token, socket, (err, response) => {
        socket.join(data.roomTitle);
        //update the list of active users in room/{} page
        socket.broadcast.to(data.roomTitle).emit('updateUsersList', JSON.stringify(response.users));

        socket.emit('updateUsersList', JSON.stringify(response.users));
      });
    });
  });

  return next();
}

exports.register.attributes = {
	name: 'SocketsPlugin'
}

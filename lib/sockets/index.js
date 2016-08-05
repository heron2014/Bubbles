'use strict';

const socketIO = require('socket.io');
const pub = require('./helpers').pub;
const sub = require('./helpers').sub;
const adapter = require('socket.io-redis');
const dbHelpers = require('../db/helpers');
const config = require('../config');

exports.register = (server, options, next) => {

  const io = socketIO(server.listener);
  io.set('transports', ['websocket']);
  io.adapter(adapter({
    pub,
    sub
  }));


  console.log('pub', pub);
  io.of('/roomslist').on('connection', (socket) => {
    dbHelpers.getAllRooms((errR, rooms) => {
      socket.on('getChatRooms', () => {
        socket.emit('chatRoomsList', JSON.stringify(rooms));
        socket.broadcast.emit('chatRoomsList', JSON.stringify(rooms));
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

            dbHelpers.getAllRooms((err, updatedRooms) => {
              //Emit an updated list to the creator
              socket.emit('chatRoomsList', JSON.stringify(updatedRooms));
              //emit an updated list to everyone connected to the rooms page
              socket.broadcast.emit('chatRoomsList', JSON.stringify(updatedRooms))
            })
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
        //when a socket exits
      socket.on('disconnect', () => {
        //find the room , to which the socket is connected to and purge the user
        let room = dbHelpers.removeUserFromRoom(data.roomTitle, socket, (err, response) => {
          socket.leave(data.roomTitle);
          socket.broadcast.to(data.roomTitle).emit('updateUsersList', JSON.stringify(response.users));
        });
      });

      //when a new message arrives
      socket.on('newMessage', data => {
        //message back in new event 'inMessage'
        socket.broadcast.to(data.roomTitle).emit('inMessage', JSON.stringify(data));
      });
    });
  });

  return next();
}

exports.register.attributes = {
	name: 'SocketsPlugin'
}

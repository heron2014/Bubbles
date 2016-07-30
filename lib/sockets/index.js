'use strict';

const socketIO = require('socket.io');

exports.register = (server, options, next) => {

  const io = socketIO(server.listener);
  
  io.of('/roomslist').on('connection', (socket) => {
    // console.log('Socket connected to the client');
  });

  return next();
}

exports.register.attributes = {
	name: 'SocketsPlugin'
}

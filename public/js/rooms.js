'use strict';
console.log('working');

(function ($) {

  $(() => {
    var socket = io('http://localhost:3000/roomslist');

    socket.on('connect', () => console.log('Connected to the Server'));
  });

}(window.jQuery))

'use strict';
console.log('working');

(function ($) {

  $(() => {
    var socket = io('http://localhost:3000/roomslist'); //roomslist is namespace for socket - it is not a route!

    socket.on('connect', () => console.log('Connected to the Server'));
  });

}(window.jQuery))

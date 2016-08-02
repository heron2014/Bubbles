'use strict';
console.log('working');

(function ($) {

  $(() => {
    var socket = io('http://localhost:3000/roomslist'); //roomslist is namespace for socket - it is not a route!
    var newRoomInput = $("input[name='newRoom']");

    var renderChatRooms = chatrooms => {
      var roomsListUL = $('#roomsListUL');
      var listStr = '';
      for (let cat of chatrooms) {
        listStr += `<a href="/room/${cat.title}"><li>${cat.title}</li>`;
      }
      roomsListUL.html('').append(listStr);
    }

    // get the list of chatrooms
    socket.emit('getChatRooms');
    socket.on('chatRoomsList', chatrooms => {
      renderChatRooms(JSON.parse(chatrooms));
    });

    socket.on('connect', () => console.log('Connected to the Server'));

    $('#createBtn').on('click', (evt) => {
      if (newRoomInput !== '') {
        socket.emit('createNewRoom', newRoomInput.val());
        newRoomInput.val('');
      }
    })
  });

}(window.jQuery))

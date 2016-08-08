'use strict';

(function ($) {

  $(() => {
    var host = $("input[name='host']").val().toString();
    var socket = io(host + '/roomslist',{
      transports: ['websocket']
    }); //roomslist is namespace for socket - it is not a route!
    var newRoomInput = $("input[name='newRoom']");

    var compare = function (a, b) {
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    }
     var renderChatRooms = chatrooms => {
      var roomsListUL = $('#roomsListUL');
      var listStr = '';
      for (var cat of chatrooms) {
        listStr += `<a href="/room/${cat.title}"><li>${cat.title}<span>${cat.users.length}</span></li>`;
      }
      roomsListUL.html('').append(listStr);
    }

    // get the list of chatrooms
    socket.emit('getChatRooms');
    socket.on('chatRoomsList', chatrooms => {
      var order = JSON.parse(chatrooms).sort(compare);
      renderChatRooms(order);
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

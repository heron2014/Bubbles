'use strict';

(function ($) {

  $(() => {
    let host = $("input[name='host']").val().toString();
    let socket = io(host + '/roomslist',{
      transports: ['websocket']
    }); //roomslist is namespace for socket - it is not a route!
    let newRoomInput = $("input[name='newRoom']");

    let compare = function (a, b) {
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    }
    let renderChatRooms = chatrooms => {
      let roomsListUL = $('#roomsListUL');
      let listStr = '';
      for (let cat of chatrooms) {
        listStr += `<a href="/room/${cat.title}"><li>${cat.title}</li>`;
      }
      roomsListUL.html('').append(listStr);
    }

    // get the list of chatrooms
    socket.emit('getChatRooms');
    socket.on('chatRoomsList', chatrooms => {
      let order = JSON.parse(chatrooms).sort(compare);
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

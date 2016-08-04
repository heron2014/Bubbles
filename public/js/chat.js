'use strict';

(function ($) {

  $(() => {
    var socket = io('http://localhost:3000/chatter');
    var userName = $("input[name='userName']").val();
    var userPic = $("input[name='userPic']").val();
    var roomId = $("input[name='roomId']").val();
    var roomTitle = $("input[name='roomTitle']").val();
    var chatUsers = $('.chatUsers');

    socket.on('connect', () => {
      socket.emit('join', {
        userName,
        roomId,
        userPic,
        roomTitle
      });
    });

    let userList = user => {
      return `<img src="${user.userPic}" alt="${user.userName}">
              <p>${user.userName}</p>`;
    };

    socket.on('updateUsersList', data => {
      let parsedData = JSON.parse(data);
      let usersListData = '';
      for (let user of parsedData) {
        usersListData += userList(user);
      }
      chatUsers.html('').html(usersListData);
    })

  });

}(window.jQuery))

'use strict';

(function ($) {

  $(() => {
    let host = $("input[name='host']").val().toString();
    let socket = io(host + '/chatter', {
      transports: ['websocket']
    });
    let userName = $("input[name='userName']").val();
    let userPic = $("input[name='userPic']").val();
    let roomId = $("input[name='roomId']").val();
    let roomTitle = $("input[name='roomTitle']").val();
    let chatUsers = $('.chatUsers');
    let chatInput = $("input[name='userInput']");
    let chatMessagesDiv = $('.chatMessages');

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

    //update feed/messages function
    let updateFeed = (userPic, message) => {
      let template = `<div class="chatBlock">
                        <div class="userPic"><img src="${userPic}"></div>
                        <div class="chatMsg">${message}</div>
                      </div>;`
      //first we hide , then latest messages goes first - prependTo , slideDown will animate the message for 2s
      $(template).hide().prependTo(chatMessagesDiv).slideDown(200);
    }


    //keyup event listens for pressing enter button
    // I dont use arrow function because I need access to 'this' keyword which reference to input field
    chatInput.on('keyup', function(evt) {
      evt.preventDefault();
      let messageField = $(this);
      // if the user press enter (13) and the input is not empty
      if (evt.which === 13 && messageField.val() !== '') {
        socket.emit('newMessage', {
          roomTitle,
          roomId,
          userName,
          userPic,
          message: messageField.val()
        });

        //update the local feed
        updateFeed(userPic, messageField.val());
        //empty the input for next message
        messageField.val('');
      }
    });

    //get the messages from other users
    socket.on('inMessage', data => {
      let parsedData = JSON.parse(data);
      updateFeed(parsedData.userPic, parsedData.message);
    })
  });

}(window.jQuery))

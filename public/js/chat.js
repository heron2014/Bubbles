'use strict';

(function ($) {

  $(() => {
    var host = $("input[name='host']").val().toString();
    var socket = io(host + '/chatter', {
      transports: ['websocket']
    });
    var userName = $("input[name='userName']").val();
    var userPic = $("input[name='userPic']").val();
    var roomId = $("input[name='roomId']").val();
    var roomTitle = $("input[name='roomTitle']").val();
    var chatUsers = $('.users-list');
    var chatInput = $("input[name='userInput']");
    var chatMessagesDiv = $('.chatMessages');
    var slideOn = $('#slide-on');

    slideOn.on('click', function (evt) {
      var activeUsersDiv = $('.active-users');
      if(activeUsersDiv.css("right") == "-120px") {
       activeUsersDiv.animate({"right": '+=120'});
       $(this).animate({"right": '+=120'});
      } else{
       activeUsersDiv.animate({"right": '-=120'});
       $(this).animate({"right": '-=120'});
      }
    })

    socket.on('connect', () => {
      socket.emit('join', {
        userName,
        roomId,
        userPic,
        roomTitle
      });
    });

    var userList = user => {
      return `<li><a href="#"><img src="${user.userPic}" alt="${user.userName}"></a>
              <a href="#">${user.userName}</a></li>`;
    };

    socket.on('updateUsersList', data => {
      var parsedData = JSON.parse(data);
      var usersListData = '';
      for (var user of parsedData) {
        usersListData += userList(user);
      }
      chatUsers.html('').html(usersListData);
    })

    //update feed/messages function
    var updateFeed = (userPic, message) => {
      var template = `<div class="chatBlock">
                        <p class="msg">${message}</p>
                        <p><img src="${userPic}"></p>
                      </div>;`
      //first we hide , then latest messages goes first - prependTo , slideDown will animate the message for 2s
      $(template).hide().prependTo(chatMessagesDiv).slideDown(200);
    }

    //update feed/messages function
    var updateFeedFromOthers = (userPic, message) => {
      var template = `<div class="chatBlockOthers">
                        <p><img src="${userPic}"></p>
                        <p class="msg">${message}</p>
                      </div>;`
      //first we hide , then latest messages goes first - prependTo , slideDown will animate the message for 2s
      $(template).hide().prependTo(chatMessagesDiv).slideDown(200);
    }


    //keyup event listens for pressing enter button
    // I dont use arrow function because I need access to 'this' keyword which reference to input field
    chatInput.on('keyup', function(evt) {
      evt.preventDefault();
      var messageField = $(this);
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
      var parsedData = JSON.parse(data);
      updateFeedFromOthers(parsedData.userPic, parsedData.message);
    })
  });

}(window.jQuery))

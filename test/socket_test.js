var io = require('socket.io-client'),
  server = require("../server.js"),
  test = require("tape");

var socketURL = 'http://0.0.0.0:7000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

var options = {
  method: "GET",
  url: "/"
};

/* Test 1 - A Single User */
test('Should broadcast new user once they connect',function(t){
  var client = io.connect(socketURL, options);

  client.on('connect',function(data){
    client.emit('connection name',chatUser1);
  });

  client.on('new user',function(usersName){
    t.equal(typeof usersName, "string", "Type of usersName is a string");
    t.equal(usersName, chatUser1.name + " has joined.", "Chat User has joined successfully");
    t.equal(client.connected, true, "Socket client is connected");
    client.disconnect();
    t.end();
  });
});
  
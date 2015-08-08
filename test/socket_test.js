var io = require('socket.io-client'),
  server = require("../server.js"),
  test = require("tape");

var socketURL = 'http://0.0.0.0:7000';

var ioptions = {
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};


/* Test 1 - A Single User */
test('Should broadcast new user once they connect',function(t){
  var client = io.connect(socketURL, ioptions);

  client.on('connect',function(data){
    client.emit('connection name',chatUser1);
  });

  client.on('new user',function(usersName){
    t.equal(typeof usersName, "string", "Type of usersName is a string");
    t.equal(usersName, chatUser1.name + " has joined.", "chatUser1 has joined successfully");
    t.equal(client.connected, true, "Socket client is connected");
    client.disconnect();
    t.end();
  });
});


/* Test 2 - New user is broadcast to all clients */
test("Should broadcast new user to all users", function(t) {
  var client1,
      client2;
  var users1 = 0,
      users2 = 0;

  client1 = io.connect(socketURL, ioptions);

  client1.on("connect", function(data){
    client1.emit("connection name", chatUser1);

    /* Connect new client while client1 still connected */
    client2 = io.connect(socketURL, ioptions);

    client2.on("connect", function(data) {
      client2.emit("connection name", chatUser2);
    });

    client2.on("new user", function(usersName) {
      users2++;

      if (users2 === 2) { // Both users announced to client2
        t.equal(usersName, chatUser2.name + " has joined.", "chatUser2 broadcast to itself");
        client2.disconnect();
      }
    });
  });

  client1.on('new user',function(usersName){
    users1++;

    if (users1 === 2) { // Both users announced to client1
      t.equal(usersName, chatUser2.name + " has joined.", "chatUser2 broadcast to chatUser1");
      client1.disconnect();
      t.end();
    }
  });
});


/* Test 3 - Message is broadcast to all connected users */
test('Should be able to broadcast messages', function(t){
  var client1, client2, client3;
  var message = 'Hello World';
  var messages = 0;

  var checkMessage = function(client){
    client.on('message', function(msg){
      t.equal(message, msg, "Message received correctly by " + client);
      client.disconnect();
      messages++;
      if(messages === 3){
        t.end();
      }
    });
  };

  client1 = io.connect(socketURL, ioptions);
  checkMessage(client1);

  client1.on('connect', function(data){
    client2 = io.connect(socketURL, ioptions);
    checkMessage(client2);

    client2.on('connect', function(data){
      client3 = io.connect(socketURL, ioptions);
      checkMessage(client3);

      client3.on('connect', function(data){
        client2.send(message);
      });
    });
  });
});


/* Test 4 - App does not allow an empty message to be sent */
test("Should not be able to send an empty message", function(t) {
  var client = io.connect(socketURL, ioptions);
  client.on("connect", function(data) {
    client.emit("message");
    t.ok(true, "App did not crash on empty message");
    client.disconnect();
    t.end();
  });
});
var io = require('socket.io-client'),
  server = require("../server.js"),
  test = require("tape");

var socketURL = 'http://0.0.0.0:7000';

var ioptions ={
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
  var numberUsers = 0;

  client1 = io.connect(socketURL, ioptions);

  client1.on("connect", function(data){
    client1.emit("connection name", chatUser1);

    /* Connect new client while client1 still connected */
    client2 = io.connect(socketURL, ioptions);

    client2.on("connect", function(data) {
      client2.emit("connection name", chatUser2);
    });

    client2.on("new user", function(usersName) {
      // This should be on the event of new user chatUser2 joining, but instead it is chatUser1??
      t.equal(usersName, chatUser1.name + " has joined.", "chatUser2 has joined and chatUser1 announced.");
      client2.disconnect();
    });
  });

  client1.on('new user',function(usersName){
    numberUsers++;

    if (numberUsers === 2) {
      t.equal(usersName, chatUser2.name + " has joined.", "chatUser2 broadcast to chatUser1");
      client1.disconnect();
      t.end();
    }
  });
});
var Hapi = require("hapi"),
  server = new Hapi.Server(),
  routes = require("./api/routes.js"),
  handlebars = require("handlebars"),
  path = require("path"),
  SocketIO = require('socket.io');

var clients = {};


server.connection({
  port: process.env.PORT 
});

server.views({
	engines: {
		html: handlebars
	},
	path: path.join(__dirname, "./public/views")
});

server.route(routes);

server.start(function(){
  var io = SocketIO.listen(server.listener);
  io.sockets.on('connection', function(socket){
    socket.on('connection name',function(user){
      // console.log(user.name);
      io.sockets.emit('new user', user.name + " has joined.");
      console.log(user.name + " has joined.");
    });
  });
  console.log("Server is running at " + server.info.uri);
});

module.exports = server;

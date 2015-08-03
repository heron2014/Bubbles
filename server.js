var Hapi = require("hapi"),
  server = new Hapi.Server(),
  routes = require("./api/routes.js");


server.connection({
  port: process.env.PORT || 8000
});

server.route(routes);

server.start(function(){
  console.log("Server is running at " + server.info.uri);
});

module.exports = server;

var Hapi = require("hapi"),
  server = new Hapi.Server(),
  routes = require("./api/routes.js"),
  handlebars = require("handlebars"),
  path = require("path");


server.connection({
  port: process.env.PORT || 8000
});

server.views({
	engines: {
		html: handlebars
	},
	path: path.join(__dirname, "./public/views")
});

server.route(routes);

server.start(function(){
  console.log("Server is running at " + server.info.uri);
});

module.exports = server;

var handlers = require("./handlers.js");

var routes = [
  {
    method: "GET",
    path: "/",
    handler: handlers.home
  },
  {
    method: "GET",
    path: "/public/{path*}",
    handler: {
      directory: {
        path: "../public"
      }
    }
  }
];

module.exports = routes;
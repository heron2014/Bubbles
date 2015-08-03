var handlers = require("./handlers.js");

var routes = [
  {
    method: "GET",
    path: "/",
    handler: handlers.home
  }
];

module.exports = routes;
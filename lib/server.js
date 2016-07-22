'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Home = require('./home');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000
});

server.register([Inert, Vision, Home], error => {

  if (error) {
    throw error;
  }

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: '../views',
    layoutPath: '../views/layout'
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server is running at: ', server.info.uri)
  });

});

module.exports = server;

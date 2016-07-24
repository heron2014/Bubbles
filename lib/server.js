'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Home = require('./home');
const Hoek = require('hoek');
const HapiError = require('hapi-error')

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000
});

server.register([Inert, HapiError, Vision, Home], error => {

  Hoek.assert(!error, 'no errors registering plugins');

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: '../views',
    layoutPath: '../views/layout'
  });

  server.start((err) => {
    Hoek.assert(!err, 'no errors starting server');
    console.log('Server is running at: ', server.info.uri)
  });

});

module.exports = server;

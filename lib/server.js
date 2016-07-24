'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Home = require('./home');
const Room = require('./room');
const Assets = require('./assets');
const Hoek = require('hoek');
const HapiError = require('hapi-error');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000
});

server.register([Inert, HapiError, Vision, Assets, Home, Room], error => {

  Hoek.assert(!error, 'no errors registering plugins');

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname + '/../views',
    path: '../views',
    layout: 'default',
    layoutPath: 'layout'
  });

  server.start((err) => {
    Hoek.assert(!err, 'no errors starting server');
    console.log('Server is running at: ', server.info.uri)
  });

});

module.exports = server;

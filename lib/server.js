'use strict';
require('env2')('.env');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Login = require('./login');
const Home = require('./home');
const Room = require('./room');
const Assets = require('./assets');
const Hoek = require('hoek');
const HapiError = require('hapi-error');
const socketPlugin = require('./sockets');
const Bell = require('bell');
const HapiAuthJWT = require('hapi-auth-jwt2');

const Auth = [Bell, HapiAuthJWT];
const Plugins = [Inert, Vision, Assets, Login, Home, Room, socketPlugin, HapiError];

const config = require('./config');
const validate = require('./validate');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000
});

server.register(Auth, error => {

  Hoek.assert(!error, 'no errors registering plugins');

  server.auth.strategy('jwt', 'jwt', {
    key: config.sessionSecret,
    validateFunc: validate,
    verifyOptions: {
      ignoreExpiration: true
    }
  });

  server.auth.strategy('facebook', 'bell', {
    provider: 'facebook',
    password: config.sessionSecret,
    clientId: config.fb.clientID,
    clientSecret: config.fb.clientSecret,
    scope: config.fb.scope,
    isSecure: false
  });

  server.auth.default('jwt');

});


server.register(Plugins, error => {

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

'use strict';
require('env2')('.env');

const dbURL = process.env.REDISCLOUD_URL || process.env.DEVELOPMENT;
const redisURL = require('url').parse(dbURL);
const redisPassword = redisURL.auth.split(':')[1] || '';


module.exports = {
  host: process.env.HOST || 'http://localhost:3000',
  dbURI: process.env.DBURI,
  sessionSecret: process.env.SESSION_SECRET,
  fb: {
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    scope: ["public_profile", "user_about_me", "email"]
  },
  redis: {
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisPassword
  }
}

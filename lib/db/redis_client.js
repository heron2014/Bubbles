'use strict';
require('env2')('.env');
const url = require('url');
const redis = require('redis');

const dbURL = process.env.REDISCLOUD_URL || process.env.DEVELOPMENT;
const redisURL = url.parse(dbURL);
const client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

if (redisURL.auth) {

  client.auth(redisURL.auth.split(':')[1]);
}

client.on('error', (err) => {
    console.trace();
    console.error(err);
});
module.exports = client;

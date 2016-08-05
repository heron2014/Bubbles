'use strict';
require('env2')('.env');
const url = require('url');
const redis = require('redis');

const redisURL = url.parse(process.env.REDISCLOUD_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

console.log('redisURL', redisURL);
if (redisURL.auth) {

  client.auth(parsedURL.auth.split(':')[1]);
}

client.on('error', (err) => {
    console.trace();
    console.error(err);
});
module.exports = client;

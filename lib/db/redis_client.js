'use strict';
require('env2')('.env');
const url = require('url');
const redis = require('redis');

const redisURL = url.parse(process.env.REDISCLOUD_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

module.exports = client;

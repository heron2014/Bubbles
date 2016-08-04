'use strict';

const redis = require('redis');
const url = require('url');

const dbURL = process.env.REDISCLOUD_URL || process.env.redisURL;
const parsedURL = url.parse(dbURL);

const pub = redis.createClient(parsedURL.port, parsedURL.hostname, { no_ready_check: true });
const sub = redis.createClient(parsedURL.port, parsedURL.hostname, { return_buffers: true, no_ready_check: true });

//return_buffers: true is sending data in its roiginal state , no stringify by default

//password
if (parsedURL.auth) {
  pub.auth(parsedURL.auth.split(':')[1]);
  sub.auth(parsedURL.auth.split(':')[1]);
}

module.exports = {
  pub,
  sub
};

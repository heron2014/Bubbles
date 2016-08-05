'use strict';

let url = require('url');
let redis = require('redis');
let bluebird = require('bluebird');

bluebird.promisifyAll(redis);

if (!process.env.DEVELOPMENT && !process.env.REDISCLOUD_URL) {
    console.error("A redis url is required.");
    console.error("To run the main app, set the REDISCLOUD_ONYX_URL environment variable.");
    console.error("To run tests, set the DEVELOPMENT environment variable.");
    process.exit();
}

let dbURL = process.env.DEVELOPMENT || process.env.REDISCLOUD_URL;


let parsedURL = url.parse(dbURL);
let client = redis.createClient(parsedURL.port, parsedURL.hostname, { no_ready_check: true });

if (parsedURL.auth) {

    client.auth(parsedURL.auth.split(':')[1]);
}

client.on('error', (err) => {
    console.trace();
    console.error(err);
});

module.exports = client;

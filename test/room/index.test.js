'use strict';

const test = require('tape');
const server = require('../../lib/server.js');
const config = require('../../lib/config');
var JWT = require('jsonwebtoken');
const redisClient = require('redis-connection')();


test("Attempt to access /rooms content (without auth token)", (t) => {
  t.plan(1);

  const options = {
    method: "GET",
    url: "/rooms"
  };

  server.inject(options, (response) => {
    t.equals(response.statusCode, 401, "No Token should fail");
    t.end();
  });
});

test("Attempt to access /rooms content (with an INVALID Token)", (t) => {
  t.plan(1);
  const token = 'some_wrong_token';

  const options = {
    method: "GET",
    url: "/rooms",
    headers: {  cookie: "token=" + token }
  };

  server.inject(options, (response) => {
    t.equal(response.statusCode, 401, "INVALID Token should fail");
    t.end();
  });
});


test("Simulate Authentication, token ok", (t) => {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);

  const options = {
    method: "GET",
    url: "/rooms",
    headers: { cookie: "token=" + token },
    credentials: { id: "1234", "displayName": "Anita", valid: true}
  };

  redisClient.set(1234, JSON.stringify({ id: "1234", "displayName": "Anita", valid: true}));

  server.inject(options, (response) => {
    t.equals(response.statusCode, 200, "VALID Token should succeed!");
    t.end();
  });
});

test("Authentication failed: right JWT token but valid property is false", (t) => {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);

  const options = {
    method: "GET",
    url: "/rooms",
    headers: { cookie: "token=" + token }
  };

  redisClient.set(1234, JSON.stringify({ id: "1234", "displayName": "Anita", valid: false}));

  server.inject(options, (response) => {
    t.equals(response.statusCode, 401, "Authentication fails!");
    t.end();
  });
});

test("Authentication failed: right JWT token but user does not exist in redis", (t) => {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);

  const options = {
    method: "GET",
    url: "/rooms",
    headers: { cookie: "token=" + token }
  };

  server.inject(options, (response) => {
    t.equals(response.statusCode, 401, "Authentication fails");
    t.end();
  });
});


test("Simulate Authentication on /room/dinner, token ok", (t) => {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);

  const options = {
    method: "GET",
    url: "/room/dinner",
    headers: { cookie: "token=" + token },
    credentials: { id: "1234", "displayName": "Anita", valid: true}
  };

  redisClient.set(1234, JSON.stringify({ id: "1234", "displayName": "Anita", valid: true}));

  server.inject(options, (response) => {
    t.equals(response.statusCode, 200, "VALID Token should succeed!");
    t.end();
  });
});

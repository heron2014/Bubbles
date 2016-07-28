'use strict';

const test = require('tape');
const server = require('../../lib/server.js');
const url = require('url');
const qs = require('qs');
const config = require('../../lib/config');
var JWT = require('jsonwebtoken');
const redisClient = require('redis-connection')();
test('/login endpoint redirects to facebook', (t) => {
  t.plan(3);

  let actual, expected;
  const options = {
    url: '/login',
    method: 'GET'
  };

  server.inject(options, (response) => {
    const header = response.headers['set-cookie'].toString();
    const cookie = header.split('=')[1].split(';')[0];

    actual = response.statusCode;
    expected = 302;
    t.equals(actual, expected, 'Successful redirect');

    var redirectOpts = url.parse(response.headers.location);
    actual = redirectOpts.host;
    expected = 'www.facebook.com';
    t.equals(actual, expected, 'redirect is to Facebook');

    actual = qs.parse(redirectOpts.query).client_id;
    expected = config.fb.clientID;
    t.equals( actual, expected, 'Client Id is in redirect');
    t.end();
  });
})

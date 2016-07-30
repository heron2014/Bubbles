'use strict';

const test = require('tape');
const server = require('../../lib/server');
const JWT = require('jsonwebtoken');
const config = require('../../lib/config');

test("Logout to end the session", function(t) {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);

  const options = {
    method: 'GET',
    url: '/logout',
    headers: { cookie : 'token=' + token }
  };

  server.inject(options, function(res) {
    t.equal(res.statusCode, 302, "Logout succeeded, redirect to home page");
    t.end();
  });
});

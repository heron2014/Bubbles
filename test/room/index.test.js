'use strict';

const test = require('tape');
const server = require('../../lib/server.js');

test('Request for /rooms endpoint ', (t) => {
  t.plan(1);

  const htmlRequest = {
    method: 'GET',
    url: '/rooms',
    headers: {'Accept': 'text/html'}
  };

  server.inject(htmlRequest, (res) => {

    const actual = res.statusCode;
    const expected = 200;
    t.equals(actual, expected, 'Status code was as expected');
  });
});

test('Request for /rooms/testRoom endpoint ', (t) => {
  t.plan(1);

  const htmlRequest = {
    method: 'GET',
    url: '/room/testRoom',
    headers: {'Accept': 'text/html'}
  };

  server.inject(htmlRequest, (res) => {

    const actual = res.statusCode;
    const expected = 200;
    t.equals(actual, expected, 'Status code was as expected');
  });
});

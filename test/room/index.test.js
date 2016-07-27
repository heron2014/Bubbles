'use strict';

const test = require('tape');
const server = require('../../lib/server.js');

test('Request for /rooms endpoint with right cookie', (t) => {
  t.plan(1);

  const cookie = 'somewringcookie';

  const htmlRequest = {
    method: 'GET',
    url: '/rooms',
    headers: {'Cookie': 'bubble=' + cookie}
  };

  server.inject(htmlRequest, (res) => {
    const actual = res.statusCode;
    const expected = 401;
    t.equals(actual, expected, 'Status code was as expected');
    t.end();
  });
});

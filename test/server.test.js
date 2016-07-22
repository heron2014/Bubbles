'use strict';

const test = require('tape');
const server = require('../lib/server.js');


test('initial set up test', (t) => {
  t.plan(1)
  t.equal(2 + 3, 5, 'tape works!');
});


test('server should start', (t) => {
  t.plan(2);

  server.inject({ url: '/', method: 'GET' }, (res) => {
    t.ok(res, 'server responds');

    const actual = res.statusCode;
    const expected = 200;
    t.equals(actual, expected, 'server responds with 200 status code');
  });
});


test('stop server', (t) => {
  server.stop((err) => {
    if (err) console.log('Termination error: ' + err);
  });
  t.end();
});
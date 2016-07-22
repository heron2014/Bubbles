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


//this test is to check if is possible thrown error with the wrong plugin
test("server handles plugin error", (t) => {
  t.plan(1)
  
  const  Fake_Plugin = {};

  Fake_Plugin.register = (server, options, next) => {

    return next(new Error("failed plugin"));
  };

  Fake_Plugin.register.attributes = {
    name: "fake plugin"
  };

  server.register(Fake_Plugin, (err) => {
    t.equal(err instanceof Error, true, "Error is thrown when Fake_Plugin is register to server");
  });

});



test('teardown', (t) => {
  server.stop((err) => {
    if (err) console.log('Termination error: ' + err);
  });
  t.end();
});
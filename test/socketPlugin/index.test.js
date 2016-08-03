'use strict';

const test = require('tape');
const ioclient = require('socket.io-client');
const server = require('../../lib/server.js');
const helpers = require('../../lib/db/helpers');

test('Socket connected to the client', (t) => {
  t.plan(1);

  const ioptions = {
    transports: ['websocket'],
    'force new connection': true
  };

  const client = ioclient.connect('http://0.0.0.0:3000', ioptions);

  client.on('connect', () => {
    t.equals(client.connected, true, "Socket client is connected");
    client.disconnect();
    t.end();
  });
});

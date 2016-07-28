'use strict';

const test = require('tape');
const helpers = require('../../lib/login/helpers');

test('get the photo', (t) => {
  t.plan(1);

  const profile = {
    id: '12',
    displayName: 'anita'
  }

  helpers(profile.id, 'sometoken', (error) => {
    t.ok(error instanceof Error, true, 'no error')
    t.end();
  });
});

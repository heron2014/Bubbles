'use strict';

const test = require('tape');
const helpers = require('../../lib/db/helpers');
const db = require('../../lib/db');

test('create new user', (t) => {
  t.plan(1);

  const profile = {
    id: '12',
    displayName: 'anita'
  }

  helpers.createNewUser(profile, 'sometoken', 'somephoto', (user) => {
    t.equals(user.profileId, '12', 'Right profileId');
    db.userModel.find({ profileId: user.profileId }).remove().exec();
    t.end();
  });
});

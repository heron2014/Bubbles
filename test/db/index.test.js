'use strict';

const test = require('tape');
const helpers = require('../../lib/db/helpers');
const db = require('../../lib/db');
const redisClient = require('redis-connection')();
const config = require('../../lib/config');
const JWT = require('jsonwebtoken');

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

test('create new room', (t) => {
  t.plan(1);

  helpers.createNewRoom('testRoom', (err, response) => {
    t.equals(response, 'OK', 'Room has been created , response is OK');
    // redisClient.hdel(listName, 'testRoom');
    t.end();
  });
});

test('find room by name', (t) => {
  t.plan(1);

  let allrooms = [{title: 'testRoom'}, {title: 'SomeRoom'}];
  let tester = helpers.findRoomByName(allrooms, 'testRoom');

  t.equals(tester, true, 'Room has been found');
  t.end();
});

test('find room by name', (t) => {
  t.plan(1);

  let allrooms = [{title: 'testing'}, {title: 'SomeRoom'}];
  let tester = helpers.findRoomByName(allrooms, 'testRoom');

  t.equals(tester, false, 'Room has not been found');
  t.end();
});


test('get all the rooms', (t) => {
  t.plan(1);

  helpers.getAllRooms((err, rooms) => {
    t.equals(Object.prototype.toString.call(rooms), '[object Array]', 'Rooms are array');
    t.end();
  });
});

test('generate token', (t) => {
  t.plan(1);
  let token = 'io=DAB; connect.sid=s%3eEX_oMrDhncJEi.vx68QjR%2FNXt8i47q2Bj4; token=eyJhbVCJ9.eyJ2YWxpZCI6dHJ1ZSwiaWQiOiIxMDE1NDMwNzIyOTcxNDA5OCIA4NTY4fQ.VP9MgLdQK2ZoLAJp8yxQKA5op_RKiVc'
  let generator = helpers.generateToken(token);
  t.equals(typeof generator, 'string', 'Token generated is a string')
  t.end();
});

test('get user id', (t) => {
  t.plan(1);
  const token = JWT.sign({ id: "1234", "displayName": "Anita", valid: true}, config.sessionSecret);
  helpers.getUserId(token, (err, user) => {
    let userParsed = JSON.parse(user);
    t.equals(userParsed.id, '1234', 'User id correct')
    t.end();
  });
});

test('removed user from testRoom', (t) => {
  t.plan(1);
  // const socket = require()
  let socket = require('socket.io')
  helpers.removeUserFromRoom('testRoom', socket, (err, room) => {
    t.equals(room.title, 'testRoom', 'Removed from correct room')
    t.end();
  });
});

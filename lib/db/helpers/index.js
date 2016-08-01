'use strict';

const db = require('../');
const crypto = require('crypto');
const redisClient = require('redis-connection')();

let createNewUser = (profile, token, photo, next) => {
  let newUser = new db.userModel({
    profileId: profile.id,
    fullName: profile.displayName,
    profilePic: photo || '',
    email: profile.email,
    token: token
  });

  newUser.save(error => {
    /* istanbul ignore if */
    if (error) {
      return next(error);
    } else {
      return next(newUser);
    }
  });
}

let findOne = (profileID) => {
  return db.userModel.findOne({
    'profileId': profileID
  })
}

let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if (element.room === room) {
      return true;
    } else {
      return false;
    }
  });

  return findRoom > -1 ? true : false;
}

// a function that generates a unique roomID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

// let createNewRoom = (roomInput, callback) => {
//
//     var roomKey = 'room:' + randomHex();
//
//     redisClient.hmsetAsync(roomKey, 'title', roomInput, 'id', randomHex())
//         .then(() => {
//             callback(null, true);
//         })
//         .catch((error) => {
//             console.error('Error adding room to db:', error.cause);
//             callback(error);
//         });
// }

module.exports = {
  createNewUser,
  findOne,
  findRoomByName,
  randomHex
}

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

let findRoomByName = (allrooms, title) => {
  //findIndex is the new es6 method
  let findRoom = allrooms.findIndex((element, index, array) => {
    console.log(element.title);
    if (element.title === title) {
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


let getAllRooms = (callback) => {
  var listName = 'rooms';
  redisClient.lrange(listName, 0, -1, (err, response) => {
    if (err) {
      return callback(err);
    } else {
      //parse each object in the array
      let parsedObj = response.map((object, index) => {
          return JSON.parse(object);
      });

      return callback(null, parsedObj)
    }
  });
}

let createNewRoom = (newRoomInput, callback) => {

  let roomObject = {};
  roomObject.title = newRoomInput;
  roomObject.id = randomHex();
  roomObject.timestamp = Date.now();

  let listName = 'rooms';

  redisClient.lpush(listName, JSON.stringify(roomObject), (error, response) => {
    if (error) {
      return callback(error)
    } else {
      return callback(null, response);
    }
  });
}

module.exports = {
  createNewUser,
  findOne,
  findRoomByName,
  randomHex,
  createNewRoom,
  getAllRooms
}

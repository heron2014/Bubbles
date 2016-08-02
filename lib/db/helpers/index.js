'use strict';

const db = require('../');
const crypto = require('crypto');
const redisClient = require('redis-connection')();
const jwt  = require('jsonwebtoken');
const config = require('../../config');

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
  redisClient.hgetall(listName, (err, response) => {
    if (err) {
      return callback(err);
    } else {
      //convert object into arr
      let arr = Object.keys(response).map((key) => {
        return response[key];
      });
      //parsed each object
      let parsed = arr.map((obj) => {
        return JSON.parse(obj);
      });

      return callback(null, parsed)
    }
  });
}

let createNewRoom = (newRoomInput, callback) => {

  let roomObject = {};
  roomObject.title = newRoomInput;
  roomObject.id = randomHex();
  roomObject.timestamp = Date.now();
  roomObject.users = [];

  let listName = 'rooms';

  redisClient.hmset(listName, newRoomInput, JSON.stringify(roomObject), (error, response) => {
    if (error) {
      return callback(error)
    } else {
      return callback(null, response);
    }
  });
}

//refactor this function
let getRoom = (title, callback) => {
  var listName = 'rooms';
  redisClient.hmget(listName, title, (err, response) => {
    if (err) {
      return callback(err);
    } else {

      let parsedObj = response.map((object, index) => {
          return JSON.parse(object);
      });

      let found = parsedObj.filter((room) => {return room.title === title});

      return callback(null, found[0])
    }
  });
}

//add users to chatrooms
let addUserToRoom = (data, token, socket, callback) => {
  //get the room object
  let getCurrentRoom = getRoom(data.roomTitle, (errR, room) => {
    if (room !== undefined) {
      //get the active user's id ( id as used in session )
      let userId = getUserId(token, (err, user) => {
        let userParsed = JSON.parse(user);
        //check if this user already exist in chatroom
        if (room.users.length !== 0 ) {
          let checkUser = room.users.findIndex((element, index, array) => {

            if (element.id === user.id) {
              return true;
            } else {
              return false;
            }
          });

          //if the user is alreadt present in the room , remove him first
          if (checkUser > -1) {
            room.users.splice(checkUser, 1);
          }
        }

        //push the user into the rooms array
        room.users.push({
          socketId: socket.conn.id,
          userId: userParsed.id,
          userPic: data.userPic,
          userName: data.userName
        });

        let listName = 'rooms';
        //update room in database
        redisClient.hmset(listName, data.roomTitle, JSON.stringify(room), (errRedis, response) => {

          if (errRedis) {
            return callback(errRedis)
          }

          socket.join(data.roomTitle);
          return callback(null, room);
        })

        //return the updated room
      })
    }
  })
}

let getUserId = (token, callback) => {

  var decoded = jwt.verify(token, config.sessionSecret);
  redisClient.get(decoded.id, (rediserror, user) => {
    /* istanbul ignore if */
    if(rediserror) {
      return callback(rediserror)
    } else {
      return callback(null, user)
    }
  });
}

module.exports = {
  createNewUser,
  findOne,
  findRoomByName,
  randomHex,
  createNewRoom,
  getAllRooms,
  getRoom,
  addUserToRoom,
  getUserId
}

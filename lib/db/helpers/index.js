'use strict';

const db = require('../');
const crypto = require('crypto');
const redisClient = require('../redis_client');
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
  let findRoom = allrooms.findIndex((element, index, array) => element.title === title );
  return findRoom > -1 ? true : false;
}

// a function that generates a unique roomID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}


let getAllRooms = (callback) => {
  let listName = 'rooms';
  redisClient.hgetall(listName, (err, response) => {
    if (err) {
      /* istanbul ignore next */
      return callback(err);
    } else {
      console.log('rooommmmsss', response);
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
      /* istanbul ignore next */
      return callback(error)
    } else {
      return callback(null, response);
    }
  });
}

//refactor this function
let getRoom = (title, callback) => {
  let listName = 'rooms';
  redisClient.hmget(listName, title, (err, response) => {
    if (err) {
      /* istanbul ignore next */
      return callback(err);
    } else {
      if (response.length > 0) {
        console.log('responseee', response);
        let parsedObj = response.map((object, index) => {
            return JSON.parse(object);
        });

        console.log('------------------', parsedObj);
        let found = parsedObj.filter((room) => room.title === title );
        console.log('found', found);
        return callback(null, found[0])
      }

    }
  });
}

let getUserId = (token, callback) => {
  let decoded = jwt.verify(token, config.sessionSecret);
  redisClient.get(decoded.id, (rediserror, user) => {
    /* istanbul ignore if */
    if(rediserror) {
      return callback(rediserror)
    } else {
      return callback(null, user)
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
        let checkUser = room.users.findIndex((element, index, array) => element.userId === userParsed.id );
        //if the user is already present in the room , remove him first
        if (checkUser > -1) {
          room.users.splice(checkUser, 1);
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

          /* istanbul ignore if */
          if (errRedis) {
            return callback(errRedis)
          }

          socket.join(data.roomTitle);
          return callback(null, room);
        });
      });
    }
  })
}

let generateToken = (token) => {
  let found = token.split(';').filter((str) => str.match('token='))[0].trim();
  let generatedToken = found.substring(6);
  return generatedToken;
}

//add users to chatrooms
let removeUserFromRoom = (title, socket, callback) => {

  let getCurrentRoom = getRoom(title, (errR, room) => {
    if (room !== undefined) {
    //find user based on socket id
      let findUser = room.users.findIndex((element, index, array) => element.socketId === socket.conn.id );
      //remove the user
      if (findUser > -1) {
        room.users.splice(findUser, 1);
      }

      let listName = 'rooms';
      //update room in database
      redisClient.hmset(listName, title, JSON.stringify(room), (errRedis, response) => {

        if (errRedis) {
          /* istanbul ignore next */
          return callback(errRedis)
        }

        return callback(null, room);
      });
    }
  })
}

let validateMessages = (txt) => {
  if(txt.indexOf("<") > -1 || txt.indexOf(">") > -1) {
    txt = txt.replace(/</g, "&lt").replace(/>/g, "&gt");
  }
  return txt;
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
  getUserId,
  generateToken,
  removeUserFromRoom,
  validateMessages
}

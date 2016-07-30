'use strict';

const db = require('../');

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

module.exports = {
  createNewUser,
  findOne
}

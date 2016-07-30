'use strict';

const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

//Log an error if the connection fails
Mongoose.connection.on('error', error => {
  /* istanbul ignore next */
  console.log('Mongo Error ', error);
});

//Create a Schema that defines the structure for storing user data
const myUser = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String,
  email: String,
  token: String
});

//Turn the schema into a usable model
let userModel = Mongoose.model('chatUser', myUser);

module.exports = {
  Mongoose: Mongoose,
  userModel: userModel
}

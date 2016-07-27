'use strict';

if (process.env.NODE_ENV === 'production') {
  //offer production stage env var
  module.exports = {
    host: process.env.host || '',
    dbURI: process.env.dbURI,
    sessionSecret: process.env.sessionSecret,
    fb: {
      clientID: process.env.fbClientID,
      clientSecret: process.env.fbClientSecret,
      profileFields: ["public_profile", "user_about_me", "email"]
    }
  }
} else {
  //offer dev stage setting and data
  module.exports = require('./development.json')
}

'use strict';

const config = require('./config');
const redisClient = require('./db/redis_client');

redisClient.set('redis', 'working');
redisClient.get('redis', (rediserror, reply) => {
  /* istanbul ignore if */
  if(rediserror) {
    console.log(rediserror);
  }
  console.log('redis is ' + reply.toString()); // confirm we can access redis
});


module.exports = (decoded, request, callback) => {
  // do your checks to see if the session is valid
  redisClient.get(decoded.id, (rediserror, reply) => {
    /* istanbul ignore if */
    if(rediserror) {
      console.log(rediserror);
    }

    var session;
    if(reply) {
      session = JSON.parse(reply);
    }
    else { // unable to find session in redis ... reply is null
      /* istanbul ignore next */
      return callback(rediserror, false);
    }

    if (session.valid === true) {
        /* istanbul ignore next */
      return callback(rediserror, true);
    }
    else {
      return callback(rediserror, false);
    }
  });
};

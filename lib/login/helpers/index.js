'use strict';

const FB = require('fb');

module.exports = (id, token, next) => {
  FB.setAccessToken(token);

  FB.api('/me/picture?redirect=false&height=50&width=50', 'GET', {}, (response) => {

    if (response && !response.error) {
      /* istanbul ignore next */
      return next(null, response.data.url);
    } else {
      return next(new Error())
    }
  });
}

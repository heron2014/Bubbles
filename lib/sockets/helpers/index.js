// var redis = require('redis');
// var url = require('url');
//
// var dbURL = process.env.REDISCLOUD_URL || "http://127.0.0.1:6379";
// var parsedURL = url.parse(dbURL);
//
// var pub = redis.createClient(parsedURL.port, parsedURL.hostname, { no_ready_check: true }),
//     sub = redis.createClient(parsedURL.port, parsedURL.hostname, { no_ready_check: true });
// if (parsedURL.auth) {
//
//     pub.auth(parsedURL.auth.split(':')[1]);
//     sub.auth(parsedURL.auth.split(':')[1]);
// }
// sub.subscribe("notify");
//
// pub.on('error', (err) => {
//     console.trace('Redis pub');
//     console.error(err.stack);
// });
//
// sub.on('error', (err) => {
//     console.trace('Redis sub');
//     console.error(err.stack);
// });
//
//
// module.exports = {
//     pub: pub,
//     sub: sub
// };

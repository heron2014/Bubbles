'use strict';
const dbHelpers = require('../db/helpers');
exports.register = (server, options, next) => {

	server.route([
	{
		method: 'GET',
		path: '/rooms',
		config: {
			handler: (request, reply) => {
				const context = {
					name: request.auth.credentials.displayName
				};

				dbHelpers.findOne(request.auth.credentials.id)
					.then(user => {
						console.log('uuuuuuuuuuu',user);
					reply.view('rooms', {user: user});
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/room/{title}',
		config: {
			handler: (request, reply) => {
				let title = encodeURIComponent(request.params.title);
				reply.view('room', {title: title});
			}
		}
	}]);

	return next();
}

exports.register.attributes = {
	name: 'Room'
}

'use strict';
const dbHelpers = require('../db/helpers');
exports.register = (server, options, next) => {

	server.route([
	{
		method: 'GET',
		path: '/rooms',
		config: {
			handler: (request, reply) => {
				if (request.auth.isAuthenticated) {
					dbHelpers.findOne(request.auth.credentials.id)
						.then(user => {
						reply.view('rooms', {user: user});
					})
				} else {
					return reply.redirect('/')
				}
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

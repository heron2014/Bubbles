'use strict';

exports.register = (server, options, next) => {

	server.route({
		method: 'GET',
		path: '/logout',
		config: {
			handler: (request, reply) => {
				reply.redirect('/').unstate('token');
			}
		}

	});

	return next();
}

exports.register.attributes = {
	name: 'Logout'
}

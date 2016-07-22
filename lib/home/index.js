'use strict';

exports.register = (server, options, next) => {

	server.route({
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			reply.view('index');
		}
	});

	return next();
}

exports.register.attributes = {
	name: 'Home'
}
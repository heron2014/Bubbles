'use strict';

exports.register = (server, options, next) => {

	server.route([
	{
		method: 'GET',
		path: '/rooms',
		handler: (request, reply) => {
			reply.view('rooms');
		}
	},
	{
		method: 'GET',
		path: '/room/{title}',
		handler: (request, reply) => {
			let title = encodeURIComponent(request.params.title);
			reply.view('room', {title: title});
		}
	}]);

	return next();
}

exports.register.attributes = {
	name: 'Room'
}
'use strict';

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
				reply.view('rooms', {name: context.name});
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

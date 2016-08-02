'use strict';
const dbHelpers = require('../db/helpers');

exports.register = (server, options, next) => {

	server.route([
	{
		method: 'GET',
		path: '/rooms',
		config: {
			handler: (request, reply) => {
				 /* istanbul ignore if*/
				if (!request.auth.isAuthenticated) {
					return reply.redirect('/');
				}

				dbHelpers.findOne(request.auth.credentials.id)
					.then(user => {
					reply.view('rooms', {user: user});
				});
			}
		}
	},
	{
		method: 'GET',
		path: '/room/{title}',
		config: {
			handler: (request, reply) => {
				let title = encodeURIComponent(request.params.title);
				let getRoom = dbHelpers.getRoom(title, (err, room) => {
					if (room) {
						dbHelpers.findOne(request.auth.credentials.id)
							.then(user => {
								reply.view('room', {user: user, title: room.title, id: room.id});
							})
					} else {
						reply.redirect('/rooms');
					}
				});
			}
		}
	}]);

	return next();
}

exports.register.attributes = {
	name: 'Room'
}

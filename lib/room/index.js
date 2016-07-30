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

				server.app.chatrooms = []; //this global var is only for development, memeory issue

				let chatrooms = server.app.chatrooms;

				chatrooms.push({
					title: 'Dinner',
					roomId: '12',
					users: []
				})

				chatrooms.push({
					title: 'Drinks',
					roomId: '11',
					users: []
				})


				dbHelpers.findOne(request.auth.credentials.id)
					.then(user => {
					reply.view('rooms', {user: user, chatrooms: chatrooms});
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
				reply.view('room', {title: title});
			}
		}
	}]);

	return next();
}

exports.register.attributes = {
	name: 'Room'
}

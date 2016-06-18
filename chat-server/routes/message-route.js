'use strict';

module.exports = function(app,db) {
	const message = require('./../models/message')(db);
	app.get('/api/1/messages', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		let messages = message.getMessages();
		messages.then((result) => {
			res.send(result);
		})
	});
}
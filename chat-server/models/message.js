'use strict';

const responses = require('./responses');

module.exports = function(db) {
	return {
		createMessage: function(message) {
			message.creadedAt = (new Date()).toJSON();
			db.messages.insert(message, function(err) {
			})
		},
		getMessages: function() {
			let promise = new Promise(function(resolve, reject) {
				db.messages.find({}).sort({creadedAt: 1}).exec(function (err, docs) {
					if(!err) {
						resolve(responses.message(docs));
					}
				});
			});
			return promise;
		}
	}
}
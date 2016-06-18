module.exports = {
	ok: JSON.stringify({ status: 'ok' }),
	error: {
		error: JSON.stringify({ status: 'error' }),
		notExist: JSON.stringify({ status: 'error', reason: "notExist" }),
		expired: JSON.stringify({ status: 'error', reason: "expired" }),
		validationError: JSON.stringify({ status: 'error', reason: "validationError" }),
		alreadyInUse: JSON.stringify({ status: 'error', reason: "alreadyInUse" })
	},
	user: {
		uuid: function(uuid) {
			return JSON.stringify({ status: 'ok', uuid: uuid });
		},
		user: function(user) {
			return JSON.stringify({ 
				status: 'ok', 
				username: user.name  
			});
		}
	},
	message: function(messages) {
		return JSON.stringify({
			messages: messages
		})
	}
}
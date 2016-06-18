'use strict';
const responses = require('./responses');
const md5 = require('md5');
const uuid = require('uuid');

module.exports = function(db) {
	return {
		isValidEmail: function(email) {
		  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		  return re.test(email);
		},
		isValidUser: function(user) {
			let isValid = true;
			isValid = isValid && user.name.length >= 6;
			isValid = isValid && user.password.length >= 6;
			isValid = isValid && this.isValidEmail(user.email);
			return isValid;
		},
		createUser: function(user){
			let that = this;
			let promise = new Promise(function(resolve, reject) {
				let response = {};
				db.users.findOne({ name: user.name }, function (err, existingUser) {
			    	if(existingUser === null && that.isValidUser(user)) {
			    		user.password = md5(user.password);
			    		user.uuid = uuid.v1();
			    		user.creationDate = (new Date()).toJSON();
			    		db.users.insert(user, function(err) {
			    			if(!err) {
			    				resolve(responses.user.uuid(user.uuid));
			    			} else {
			    				resolve(responses.error.error);
			    			}
			    		})
			    	} else if(existingUser !== null) {
			    		resolve(responses.error.alreadyInUse);
			    	} else {
			    		resolve(responses.error.validationError);
			    	}
				});
			})
			return promise;
		},
		loginUser: function(user) {
			console.log("valami")
			let promise = new Promise(function(resolve, reject) {
				let userUuid = uuid.v1();
				db.users.findOne({ name: user.name }, function(err, existingUser) {
					if(!err && existingUser !== null) {
						if(existingUser.password === md5(user.password)) {
							db.users.update({ name: user.name }, 
								{ $set: { "uuid": userUuid, "creationDate": (new Date).toJSON() } },
								{ upsert: true}, function (err) {
									if(!err) {
										resolve(responses.user.uuid(userUuid));
									} else {
										resolve(responses.error.error);
									}
							});
						} else {
							resolve(responses.error.validationError);
						}
					} else if(existingUser === null) {
						resolve(responses.error.notExist);
					} else {
						resolve(responses.error.error);
					}
				})
			});
			return promise;
		},
		getUser: function(uuid) {
			let promise = new Promise(function(resolve, reject) {
				db.users.findOne({ uuid: uuid }, function(err, existingUser) {
					if(existingUser !== null) {
						let currentDate = new Date();
						let creationDate = new Date(existingUser.creationDate);
						if(currentDate > creationDate.setDate(creationDate.getDate() + 20)) {
							resolve(responses.error.expired);
						} else {
							resolve(responses.user.user(existingUser));
						}
					} else {
						resolve(responses.error.notExist);
					}
				});
			})
			return promise;
		}
	}
}

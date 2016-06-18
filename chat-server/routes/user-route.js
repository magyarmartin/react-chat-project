'use strict';

module.exports = function(app,db) {
	const url = require('url');
	const User = require('./../models/user')(db);
	app.post('/api/1/user', function (req, res) {
	    res.setHeader('Content-Type', 'application/json');
	    let user = req.body.user;
	    let response = User.createUser(user);
	    response.then(function(result) {
	    	res.send(result);
	    });
	});
	 
	app.post('/api/1/user/login', function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		console.log('adsa');
		console.log(req);
		let user = req.body.user;
		console.log('user', ' ', req.body)
		let response = User.loginUser(user);
	    response.then(function(result) {
	    	console.log('result ',result)
	    	res.send(result);
	    });
	})

	app.get('/api/1/user',function (req, res) {
		let url_parts = url.parse(req.url, true);
		let query = url_parts.query;
		let userUuid = query.uuid;
		let response = User.getUser(userUuid);
	    response.then(function(result) {
	    	res.send(result);
	    });
	})
}
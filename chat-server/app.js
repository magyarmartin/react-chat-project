'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const md5 = require('md5');
const uuid = require('uuid');
const responses = require('./models/responses');
const cors = require('cors');
const http = require('http').Server(app);


var corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

const Datastore = require('nedb');
const db = {};
db.users = new Datastore({ filename: 'db/users', autoload: true });
db.messages = new Datastore({ filename: 'db/messages', autoload: true });

const userRoute = require('./routes/user-route')(app, db);
const messageRoute = require('./routes/message-route')(app, db);
const message = require('./models/message')(db);

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
	console.log('Server is running!');
});

const io = require('socket.io')(server);

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		message.createMessage(msg);
		io.emit('chat message', msg);
	});
});
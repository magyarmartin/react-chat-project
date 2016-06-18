import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import uuid from 'uuid';
import styles from './../styles/chatbox.scss';

class ChatBox extends React.Component {
	constructor() {
		super();
		this.state = {
			message: '',
			username: '',
			messages: []
		}
	}
	setMessage(e) {
		this.setState({message: e.target.value});
	}
	configureSocket() {
		this.socket = io('http://localhost:3000/');
		this.socket.on('chat message', (msg) => {
			let messages = this.state.messages;
			messages.push(msg);
			this.setState({messages: messages});
		});
	}
	sendMessage() {
		if(this.state.message.length > 0) {
			let message = {
				name: this.state.username,
				message: this.state.message
			}
			this.socket.emit('chat message', message);
			this.setState({message: ''})
			this.scrollToBottom();
		}
	}
	componentWillMount() {
		let cookie = document.cookie;
		let uuid = '';
		let that = this;
		if(cookie !== '') {
			uuid = cookie.split('=')[1];
			$.ajax({
				url:"http://localhost:3000/api/1/user",
				type:"GET",
				data:{uuid: uuid},
				dataType:"json",
			}).done(function(res) {
				if(res.status !== 'ok') {
					browserHistory.push('/');
				} else {
					that.setState({username: res.username})
					that.getPreviousMessages();
					that.configureSocket();
				}
			});
		} else {
			browserHistory.push('/');
		}
	}
	scrollToBottom() {
		let chatBox = $("#chat-box__chat-area")[0];
		chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
	}
	getPreviousMessages() {
		let that = this;
		$.ajax({
			url:"http://localhost:3000/api/1/messages",
			type:"GET",
			dataType:"json",
		}).done(function(res) {
			that.setState({messages: res.messages})
			that.scrollToBottom();
		});
	}
	keyPress(e) {
		if(e.keyCode == 13){
	        this.sendMessage();
	    }
	}
	render () {
		return (
			<div className="chat-box">
				<div className="chat-box__chat-area" id="chat-box__chat-area">
					<div className="chat-message">
						{this.state.messages.map(function(message) {
							return 	<p key={uuid.v1()} className="chat-box__chat-area__message">
										<span className="chat-message__sender">{message.name} </span><span>{message.message}</span>
									</p>
						})}
					</div>
				</div>
				<div className="panel__footer">
					<div className="login-form__input-group">
						<input  
							id="message" 
							onChange={this.setMessage.bind(this)} 
							onKeyUp={this.keyPress.bind(this)}
							value={this.state.message}
						/>
						<button type="submit" onClick={this.sendMessage.bind(this)}>Küldés</button>
					</div>
				</div>
			</div>
		)
	}
}

export default ChatBox;
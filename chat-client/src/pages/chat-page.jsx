import React from 'react';
import Panel from './../components/panel';
import ChatBox from './../components/chatbox';
import { browserHistory } from 'react-router';
import styles from './../styles/chat-page.scss';

class ChatPage extends React.Component {
	logOut() {
		document.cookie = "uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		browserHistory.push('/');
	}
	render () {
		return (
			<div>
				<nav className="nav-bar">
					<h1>Chat Roulette</h1>
					<button onClick={this.logOut.bind(this)}>Kijelentkezés</button>
				</nav>
				<Panel id="chat-panel">
					<h1>Chat</h1>
					<ChatBox/>
				</Panel>
			</div>
		)
	}
}

export default ChatPage;
import React from 'react';
import styles from './../styles/login.scss';
import $ from 'jquery';
import { browserHistory } from 'react-router';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			error: ''
		}
		contextTypes: {
    		router: React.PropTypes.object
		}
	}
	setUsername(e) {
		this.setState({
			username: e.target.value,
			error: ''
		})
	}
	setPassword(e) {
		this.setState({
			password: e.target.value,
			error: ''
		})
	}
	login() {
		let user = {
			user: {
				name: this.state.username,
				password: this.state.password
			}
		}
		let that = this;
		if(this.isValid()) {
			$.ajax({
				url:"http://localhost:3000/api/1/user/login",
				type:"POST",
				data:JSON.stringify(user),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
			}).done(function(res) {
				if(res.status === "error") {
					let errorMessage = '';
					if(res.reason === "notExist") {
						errorMessage = 'Ilyen nevű felhasználó nem létezik';
					} else if(res.reason === 'validationError') {
						errorMessage = 'Rossz jelszó';
					} else {
						errorMessage = 'Valami hiba történt, késöbb próbálja újra'
					}
					that.setState({
						error: errorMessage
					})
				} else {
					let date = new Date();
					date.setTime(date.getTime() + 20 * 24 * 3600 * 1000);
					date = date.toUTCString();
					document.cookie = `uuid=${res.uuid}; expires=${date}`;
					browserHistory.push('/chat');
				}
			});
		}
	}
	isValid() {
		let valid = true;
		if(this.state.username.length === 0) {
			valid = false;
			this.setState({
				error: 'Nem adtál meg felhasználónevet'
			})
		} else if(this.state.password.length === 0) {
			valid = false;
			this.setState({
				error: 'Nem adtál meg jelszót'
			})
		}
		return valid;
	}
	componentWillMount() {
		let cookie = document.cookie;
		let uuid = '';
		if(cookie !== '') {
			uuid = cookie.split('=')[1];
			$.ajax({
				url:"http://localhost:3000/api/1/user",
				type:"GET",
				data:{uuid: uuid},
				dataType:"json",
			}).done(function(res) {
				if(res.status === 'ok') {
					browserHistory.push('/chat');
				}
			});
		}
	}
	keyPress(e) {
		if(e.keyCode == 13){
	        this.login();
	    }
	}
	render () {
		return (
			<div>
				<p className="login-form__error">{this.state.error}</p>
				<form className="login-form" onKeyUp={this.keyPress.bind(this)}>
					<div className="login-form__input-group">
						<label htmlFor="login__username">Felhasználónév: </label>
						<input type="text" name="login__username" id="login__username" onChange={this.setUsername.bind(this)}/>
					</div>
					<div className="login-form__input-group">
						<label htmlFor="login__password">Jelszó: </label>
						<input type="password" name="login__password" id="login__password" onChange={this.setPassword.bind(this)}/>
					</div>
				</form>
				<div className="panel__footer">
					<button type="submit" onClick={this.login.bind(this)}>Küldés</button>
				</div>
			</div>
		)
	}
}

export default Login;
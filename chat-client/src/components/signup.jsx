import React from 'react';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import styles from './../styles/login.scss';

class Signup extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			passwordConfirmation: '',
			email: '',
			userError: '',
			pwdError: '',
			pwdConfError: '',
			emailError: ''
		}
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
	setUsername(e) {
		this.setState({
			username: e.target.value,
			userError: ''
		})
	}
	setPassword(e) {
		this.setState({
			password: e.target.value,
			pwdError: ''
		})
	}
	setPasswordConfirmation(e) {
		this.setState({
			passwordConfirmation: e.target.value,
			pwdConfError: ''
		})
	}
	setEmail(e) {
		this.setState({
			email: e.target.value,
			emailError: ''
		})
	}
	keyPress(e) {
		if(e.keyCode == 13){
	        this.signup();
	    }
	}
	isValid() {
		let valid = true;
		if(this.state.username.length < 6) {
			this.setState({userError: 'A felhasználónév legalább 6 karakter kell legyen'});
			valid = false;
		}
		if(this.state.password.length < 6) {
			this.setState({pwdError: 'A Jelszó legalább 6 karakter kell legyen'});
			valid = false;
		}
		if(this.state.password !== this.state.passwordConfirmation) {
			this.setState({pwdConfError: 'A két jelszónak meg kell egyeznie'});
			valid = false;
		}
		if(!this.isValidEmail(this.state.email)) {
			this.setState({emailError: 'Az email formátuma nem helyes'});
			valid = false;
		}
		return valid;
	}
	isValidEmail(email) {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	signup() {
		if(this.isValid()) {
			let user = {
				user: {
					name: this.state.username,
					password: this.state.password,
					email: this.state.email
				}
			}
			let that = this;
			$.ajax({
				url:"http://localhost:3000/api/1/user",
				type:"POST",
				data:JSON.stringify(user),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
			}).done(function(res) {
				if(res.status === "error") {
					let errorMessage = '';
					if(res.reason === "alreadyInUse") {
						errorMessage = 'Ilyen nevű felhasználó már létezik';
					} else if(res.reason === 'validationError') {
						errorMessage = 'Validációs hiba';
					} else {
						errorMessage = 'Valami hiba történt, késöbb próbálja újra'
					}
					that.setState({
						userError: errorMessage
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
	render () {
		return (
			<div>
				<form className="login-form" onKeyUp={this.keyPress.bind(this)}>
					<div className="login-form__input-group">
						<label htmlFor="signup__username">Felhasználónév: </label>
						<p className="login-form__error">{this.state.userError}</p>
						<input type="text" name="signup__username" id="signup__username" onChange={this.setUsername.bind(this)}/>
					</div>
					<div className="login-form__input-group">
						<label htmlFor="signup__password">Jelszó: </label>
						<p className="login-form__error">{this.state.pwdError}</p>
						<input type="password" name="signup__password" id="signup__password" onChange={this.setPassword.bind(this)}/>
					</div>
					<div className="login-form__input-group">
						<p className="login-form__error">{this.state.pwdConfError}</p>
						<label htmlFor="signup__password-confirmation">Jelszó ismét: </label>
						<input 
							type="password" 
							name="signup__password-confirmation" 
							id="signup__password-confirmation" 
							onChange={this.setPasswordConfirmation.bind(this)}
						/>
					</div>
					<div className="login-form__input-group">
						<p className="login-form__error">{this.state.emailError}</p>
						<label htmlFor="signup__email">Email: </label>
						<input type="email" name="signup__email" id="signup__email" onChange={this.setEmail.bind(this)}/>
					</div>
				</form>
				<div className="panel__footer">
					<button type="submit" onClick={this.signup.bind(this)}>Küldés</button>
				</div>
			</div>
		)
	}
}

export default Signup;
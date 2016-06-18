import React from 'react';
import Panel from './../components/panel';
import Login from './../components/login';
import { Link, IndexLink } from 'react-router';
import styles from './../styles/index-page.scss';

class IndexPage extends React.Component {
	render () {
		return (
			<div>
				<h1 className="page-title">Chat Roulette</h1>
				<h2 className="page-description"><span>A folytatáshoz </span>
					<IndexLink to="/">jelentkezz be</IndexLink><span> vagy </span>
					<Link to="/signup">regisztrálj</Link></h2>
				<Panel id="login-panel">
					<h1>Bejelentkezés</h1>
					{this.props.children}
				</Panel>
			</div>
		)
	}
}

export default IndexPage;
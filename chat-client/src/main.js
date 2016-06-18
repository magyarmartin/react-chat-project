var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import IndexPage from './pages/index-page';
import Login from './components/login';
import Signup from './components/signup';
import ChatPage from './pages/chat-page';
import defaultStyles from './styles/globals.scss';

ReactDOM.render(
  <Router history={browserHistory}>
  	<Route path="/" component={IndexPage}>
  		<IndexRoute component={Login}/>
  		<Route path="/signup" component={Signup}/>
  	</Route>
  	<Route path="/chat" component={ChatPage}/>
  </Router>,
  document.getElementById('container')
);
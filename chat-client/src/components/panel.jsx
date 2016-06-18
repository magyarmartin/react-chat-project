import React from 'react';
import style from './../styles/panel.scss';

class Panel extends React.Component {
	render () {
		let headContent;
		let bodyContent;
		let footerContent;
		if(Array.isArray(this.props.children)) {
			headContent = this.props.children[0];
			bodyContent = this.props.children[1];
		} else {
			bodyContent = this.props.children;
		}
		return (
			<div className="panel" id={this.props.id}>
				<div className="panel__head">
					{headContent}
				</div>
				<div className="panel__body">
					{bodyContent}
				</div>
			</div>
		)
	}
}

export default Panel;
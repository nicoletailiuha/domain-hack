import React, { Component } from 'react';

class InputBar extends Component {
	constructor() {
		super();
		this.state = {domainText : ''}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) =>{ 
		const self = this;

		if (self.state.typingTimeout) {
			clearTimeout(self.state.typingTimeout);
		}

		self.setState({
			domainText: event.target.value,
			typing: false,
			typingTimeout: setTimeout(function () {
				self.props.requestForDomainHacks(self.state.domainText);
			}, 500)
		});
	}

	render() {
		return (
			<div>
			<input type="text" value={this.state.domainText} onChange={this.handleChange}/>
			</div>
			)
	}
}

export default InputBar;

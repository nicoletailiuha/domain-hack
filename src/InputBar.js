import React, { Component } from 'react';
import './inputbar.css';

class InputBar extends Component {
	constructor() {
		super();
		this.state = {domainText : ''}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) =>{ 
		const self = this;

		//wait 1.5 second after input then send request
		if (self.state.typingTimeout) {
			clearTimeout(self.state.typingTimeout);
		}

		self.setState({
			domainText: event.target.value,
			typing: false,
			typingTimeout: setTimeout(function () {
				if (self.state.domainText.length > 0) {
					self.props.requestForDomainHacks(self.state.domainText);
				}
			}, 1500)
		});
	}

	render() {
		return (
			<div>
				<input type="text" className="bar" placeholder="domain name goes here"
						value={this.state.domainText} 
						onChange={this.handleChange}/>
			</div>
			)
	}
}

export default InputBar;

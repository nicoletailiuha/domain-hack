import React, { Component } from 'react';

class DomainHacksList extends Component {

	render() {

		var listItems = this.props.domainHacks.map(function(item) {
			return (
				<li key="{item.name}">
				</li>
				);
		});

		return (
			<ul>
			{listItems}
			</ul>
			);
	}
}

export default DomainHacksList;

import React, { Component } from 'react';
import InputBar from './InputBar'
import 'whatwg-fetch';

class App extends Component {

  constructor() {
    super();
    this.state = {domainHacks : []};
    this.requestForDomainHacks = this.requestForDomainHacks.bind(this);
  }

  requestForDomainHacks = (domainText) => {
    let self = this;
    fetch('http://localhost:8080/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: domainText
    }).then(function(data) {
      return data.json()
    }).then(function(data) {
      self.setState({domainHacks: Object.values(data)})
    })
  };

  render() {
    var listItems = this.state.domainHacks.map(function(item) {
      return (
        <li key={item.name}> 
          {item.name}
        </li> 
      ); 
    }); 

    return (
      <div>
        <InputBar requestForDomainHacks={this.requestForDomainHacks}/>
        <ul>
          {listItems} 
        </ul>
      </div>
      );
  }
}

export default App;

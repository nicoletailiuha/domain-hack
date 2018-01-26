import React, { Component } from 'react';
import InputBar from './InputBar'
import DomainHacksList from './DomainHacksList'
import 'whatwg-fetch';

class App extends Component {

  constructor() {
    super();
    this.domainHacks = [];
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
      self.domainHacks = Object.values(data);
    })
  };

  render() {
    return (
      <div>
      <InputBar requestForDomainHacks={this.requestForDomainHacks}/>
      <DomainHacksList/>
      </div>
      );
  }
}

export default App;

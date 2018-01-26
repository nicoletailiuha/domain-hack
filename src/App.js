import React, { Component } from 'react';
import InputBar from './InputBar'
import 'whatwg-fetch';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {domainHacks: []};
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
      var values = Object.values(data);
      self.setState({domainHacks: values, domainListNotEmpty: values.length > 0 });
    })
  };

  render() {
    var listItems = this.state.domainHacks.map(function(item) {
      return (
        <tr key={item.name}> 
          <td className="centered-td domain-name">{item.name}</td>
          <td className="centered-td"><img src={item.type.flagIcon} alt=""/>
          {item.type.text}</td>
          <td>{item.notes}</td>
        </tr> 
      ); 
    }); 

    var table = 
      <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Entity/Target market</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {listItems} 
          </tbody>
        </table>;

    return (
      <div>
        <p className="header-text">It's dangerous to go alone. Take these domain hacks:</p>
        <InputBar requestForDomainHacks={this.requestForDomainHacks}/>
        {table}
      </div>
    );
  }
}

export default App;

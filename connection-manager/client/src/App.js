import React, { Component } from 'react';
import db from './utils/db.js';
import './App.css';

class App extends Component {
  state = {
      conns: ""
  };

  componentDidMount = () => {
    this.getConnections();
  };

  getConnections = () => {
    db.getConnections('jsmith', connections => {
      this.setState({
        conns: connections
      })
    });
  };

  render() {
    let connections = this.state.conns;
    let connectionList = Object.keys(connections).map((connectionNo) => (
        <div className="connection">
            Database: {connections[connectionNo]}
        </div>

        // <li key={connectionNo}>
        //     {connections[connectionNo]}
        //     <button>View</button>
        // </li>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <h1> Connection Manager </h1>
        </header>
        <ul>
          {connectionList}
        </ul>
        <button>Create Connection</button>
      </div>
    );
  }
}

export default App;

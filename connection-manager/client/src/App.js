import React, { Component } from 'react';
import logo from './logo.svg';
import db from './utils/db.js';
import './App.css';

class App extends Component {
  state = {
      conns: {

      }
  };

  componentDidMount = () => {
    this.getConnections();
  };

  getConnections = () => {
    db.getConnections(connections => {
      this.setState({
        conns: connections
      })
    });
  };

  render() {
    const { connections } = this.state.conns;

    return (
      <div className="App">
        <header className="App-header">
          <h1> Connection Manager </h1>
        </header>
        <p>
          {connections}
        </p>
        <button>Create Connection</button>
      </div>
    );
  }
}

export default App;

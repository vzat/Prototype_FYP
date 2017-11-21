import React, { Component } from 'react';
import db from './utils/db.js';
import './App.css';

class App extends Component {
  state = {
      connections: {
          name: '',
          address: '',
          port: '',
          dbuser: '',
          dbpass: ''
      },
      account: {
          username: '',
          email: '',
          token: ''
      }
  };

  componentDidMount = () => {
    this.getConnections();
  };

  getConnections = () => {
    const username = 'jsmith';
    db.getConnections(username, connections => {
          for (const connNo in connections) {
              const connection = connections[connNo];

              if (connection.username === username) {
                  // Set Account Info
                  const account = {
                      username: connection.username,
                      email: connection.email,
                      token: connection.token
                  };
                  this.setState({
                      account: account
                  });

                  // Set Databases Info
                  if (connection.databases) {
                      let conns = [];
                      for (const databaseNo in connection.databases) {
                          const database = connection.databases[databaseNo];
                          const conn = {
                              name: database.name,
                              address: database.address,
                              port: database.port,
                              dbuser: database.username,
                              dbpass: database.password
                          }
                          conns.push(conn);
                      }
                      if (conns.length === 0) {
                          const conn = {
                              empty: 1
                          }
                          conns.push(conn);
                      }
                      this.setState({
                          connections: conns
                      });
                  }
              }
          }
    });
  };

  render() {
    let connections = this.state.connections;
    let connectionList = Object.keys(connections).map((connectionNo) => (
        <div className="connection">
            Database: {connections[connectionNo].name}
            <br/>
            URI:
            mongodb://
            {connections[connectionNo].dbuser}:{connections[connectionNo].dbpass}
            @{connections[connectionNo].address}:{connections[connectionNo].port}
            /{connections[connectionNo].name}
        </div>
    ));
    let account = this.state.account;

    return (
      <div className="App">
        <header className="App-header">
          <h1 class="header"> Connection Manager </h1>
          <div class="account">
            Username: {account.username}
            <br/>
            Email: {account.email}
            <br/>
            API Token: {account.token}
            <br/>
          </div>
        </header>

        {connectionList}
        <br/><br/>
        <button>Create Connection</button>
      </div>
    );
  }
}

export default App;

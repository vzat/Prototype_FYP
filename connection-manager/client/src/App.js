import React, { Component } from 'react';
import db from './utils/db.js';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

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
    const styles = {
        card: {
            height: "100%",
            width: "100%"
        }
    }

    let connections = this.state.connections;
    let connectionList = Object.keys(connections).map((connectionNo) => (
        <div className="connection">
            <Card>
                <CardHeader
                    title = {connections[connectionNo].name}
                    subtitle = {
                                  "mongodb://<dbname>:<dbpass>@" +
                                  connections[connectionNo].address +
                                  ":" +
                                  connections[connectionNo].port +
                                  "/" +
                                  connections[connectionNo].name
                               }
                    actAsExpander = {true}
                    showExpandableButton = {true}
                />
                <CardActions>
                    <RaisedButton
                        label = "View"
                        primary = {true}
                    />
                </CardActions>
                <CardText expandable={true}>
                    dbname: {connections[connectionNo].dbuser}
                    <br/>
                    dbpass: {connections[connectionNo].dbpass}
                </CardText>
            </Card>
        </div>
    ));
    let account = this.state.account;

    return (
        <MuiThemeProvider>
            <div className="App">
              <header className="App-header">
                  <h1 class="header"> Connection Manager </h1>

                  <div class="account">
                      <Card>
                          <CardHeader
                              title = {account.username}
                              subtitle = {account.email}
                              actAsExpander = {true}
                              showExpandableButton = {true}
                          />
                          <CardText expandable={true}>
                              API Token -  {account.token}
                          </CardText>
                      </Card>
                  </div>

              </header>

              {connectionList}
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <RaisedButton
                  label = "Create Connection"
              />
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import db from './utils/db.js';
import conn from './utils/conn.js';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class App extends Component {
  state = {
      connections: {
      },
      account: {
          username: '',
          email: '',
          token: ''
      },
      DBDialog: false,
      dbName: ''
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
                    if (connection.databases && connection.databases.length > 0) {
                        console.log('???');
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

  createConnection = (dbName) => {
      const username = 'jsmith';
      conn.createConnection(username, dbName, status => {
          this.getConnections();
      });
      this.setState({
          dbName: '',
          DBDialog: false
      })
  };

  dataVisualiserRedirect = (database) => {
      const token = this.state.account.token;
      window.location.href = 'http://localhost:4000?database=' + database + '&token=' + token;
  }

  openDBDialog = () => {
      this.setState({
          DBDialog: true
      });
  };

  closeDBDialog = () => {
      this.setState({
          DBDialog: false
      });
  };

  setDatabaseName = (event) => {
      this.setState({
          dbName: event.target.value
      });
  };


  render() {
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
                        onClick = {() => this.dataVisualiserRedirect(connections[connectionNo].name)}
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

    const dbActions =[
        <TextField
            hintText = "Database Name"
            fullWidth = {true}
            value={this.state.dbName}
            onChange = {this.setDatabaseName}
        />,
        <RaisedButton
            label = "Submit"
            onClick = {() => this.createConnection(this.state.dbName)}
        />,
        <RaisedButton
            label = "Cancel"
            onClick = {this.closeDBDialog}
        />
    ];

    return (
        <MuiThemeProvider>
            <div className = "App">

                <Dialog
                    title = "Add Database"
                    open = {this.state.DBDialog}
                    actions = {dbActions}
                />

                <header className = "App-header">
                    <h1 className = "header"> Connection Manager </h1>

                    <div className = "account">
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

                <div className = "create-connection">
                    <RaisedButton
                        label = "New Connection"
                        onClick = {() => this.openDBDialog()}
                    />
                </div>

                {connectionList}
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;

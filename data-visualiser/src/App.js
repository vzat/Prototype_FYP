import React, { Component } from 'react';
import './App.css';
import db from './utils/db.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class App extends Component {
    state = {
        database: 'blog',
        token: 'a123',
        collections: {
        },
        data: {
        },
        collectionDialog: false
    };

    componentDidMount = () => {
        // Get connection info
        const url = window.location.href;
        const andIndex = url.indexOf('&');
        const databaseParam = url.substring(url.indexOf('database=') + 'database='.length, andIndex);
        const tokenParam = url.substring(url.indexOf('token=') + 'token='.length);
        if (databaseParam !== null && tokenParam !== null) {
            this.setState({
                database: databaseParam,
                token: tokenParam
            });
            const self = this;
            this.getCollections(databaseParam, tokenParam).then(function(collections) {
                if (collections.length > 0) {
                    self.getData(collections[0].name);
                }
            });
        }
    };

    getCollections = (database, token) => {
        return db.getCollections(database, token, collections => {
            this.setState({
                collections: collections
            });
            return collections;
        });
    };

    getData = (collection) => {
        const database = this.state.database;
        const token = this.state.token;
        db.getDocuments(database, collection, token, documents => {
            this.setState({
                data: documents
            });
        });
    };

    openCollectionDialog = () => {
        this.setState({
            collectionDialog: true
        });
    };

    closeCollectionDialog = () => {
        this.setState({
            collectionDialog: false
        });
    };

    render() {
      const styles = {
          paper: {
              height: "100%",
              width: "100%"
          },
          menu: {
              width: "200px"
          },
          tabs: {
              width: "100%"
          },
          document: {
              width: "200px",
              height: "300px",
              overflow: "hidden"
          }
      }

      const collections = this.state.collections;
      const collectionList = Object.keys(collections).map((collection) => (
          <MenuItem
              primaryText = {collections[collection].name}
              onClick = {() => this.getData(collections[collection].name)}
          />
      ));

      const data = this.state.data;
      const documentList = Object.keys(data).map((documentNo) => (
          <div className = "Document">
              <Paper style = {styles.document}>
                  <List>
                      {
                          Object.keys(data[documentNo]).map((key) => (
                              <ListItem
                                  primaryText = {key}
                                  secondaryText= {data[documentNo][key]} />
                          ))
                      }
                  </List>
              </Paper>
          </div>
      ));

      const newCollectionActions =[
          <TextField
              hintText = "Collection Name"
              fullWidth = {true}
          />,
          <RaisedButton
              label = "Submit"
          />,
          <RaisedButton
              label = "Cancel"
              onClick = {this.closeCollectionDialog}
          />
      ];



      return (
        <MuiThemeProvider>
            <div className="App">

                <Dialog
                    title = "Add Collection"
                    open = {this.state.collectionDialog}
                    actions = {newCollectionActions}
                />

                <div className = "Menu">
                    <Paper style = {styles.paper}>
                        <h3>Collections</h3>
                        <Menu style = {styles.menu}>
                            { collectionList }
                        </Menu>
                        <RaisedButton
                            label = "New Collection"
                            onClick = {this.openCollectionDialog} />
                    </Paper>
                </div>

                <div className = "Content">
                    <Tabs style = {styles.tabs}>
                        <Tab label = "Visualised Data">
                            <div className = "PrettyData">
                                {documentList}
                            </div>
                        </Tab>
                        <Tab label = "Raw Data">
                            <div className = "RawData">
                                <pre>
                                    { JSON.stringify(data, null, '\t') }
                                  </pre>
                            </div>
                        </Tab>
                    </Tabs>
                </div>

            </div>
        </MuiThemeProvider>
      );
    }
}

export default App;

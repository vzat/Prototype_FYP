import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import db from './utils/db.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';

class App extends Component {
    state = {
        database: 'blog',
        token: 'a123',
        collections: {
        },
        data: {
        }
    };

    componentDidMount = () => {
        this.getCollections(this.state.database, this.state.token);
        // onClick = {this.getData(collections[collection].name)}
        this.getData('posts');

    };

    getCollections = (database, token) => {
        db.getCollections(database, token, collections => {
            this.setState({
                collections: collections
            });
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

    render() {
      const collections = this.state.collections;
      const collectionList = Object.keys(collections).map((collection) => (
            <MenuItem
                primaryText = {collections[collection].name}
                onClick = {() => this.getData(collections[collection].name)}
            />
      ));
      const data = this.state.data;

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
          }
      }

      return (
        <MuiThemeProvider>
            <div className="App">

                <div className = "Menu">
                    <Paper style = {styles.paper}>
                        <Menu style = {styles.menu}>
                            { collectionList }
                        </Menu>
                    </Paper>
                </div>

                <div className = "Content">
                    <Tabs style = {styles.tabs}>
                        <Tab label = "Raw Data">
                            <div className = "RawData">
                                <pre>
                                    { JSON.stringify(data, null, '\t') }
                                  </pre>
                            </div>
                        </Tab>
                        <Tab label = "Visualised Data">
                            <div className = "PrettyData">
                                Pretty Data
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

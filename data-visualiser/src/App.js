import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';

class App extends Component {
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
        }
    }

    return (
      <MuiThemeProvider>
          <div className="App">

              <div className = "Menu">
                  <Paper style = {styles.paper}>
                      <Menu style = {styles.menu}>
                          <MenuItem primaryText="DB1" />
                          <MenuItem primaryText="DB2" />
                      </Menu>
                  </Paper>
              </div>

              <div className = "Content">
                  <Tabs style = {styles.tabs}>
                      <Tab label = "Raw Data">
                          <div className = "RawData">
                              Raw Data
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

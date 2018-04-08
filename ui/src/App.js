import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import { gray, red, pink } from 'material-ui/colors';
import TabContainer from './Tabs';
import Header from './Header';
import './App.css';


const muiTheme = createMuiTheme({
  palette: {
    primary: gray,
    accent: pink,
    error: red,
    type: 'dark',
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="layoutRoot">
          <Header text={'Electronic Mail Apparatus'} />
          <TabContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

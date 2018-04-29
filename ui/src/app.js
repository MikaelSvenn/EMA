import React, { Component } from 'react';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import { gray, red, pink } from 'material-ui/colors';
import TabContainer from './components/tabs';
import Header from './components/header';
import sendMessageReducer from './message/reducers/sendMessage';
import writeMessageReducer from './message/reducers/writeMessage';
import './app.css';


const muiTheme = createMuiTheme({
  palette: {
    primary: gray,
    accent: pink,
    error: red,
    type: 'dark',
  },
});

const reducers = combineReducers({
  sendMessage: sendMessageReducer,
  writeMessage: writeMessageReducer,
});
const middleware = compose(applyMiddleware(thunk));
const store = createStore(reducers, middleware);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <div className="layoutRoot">
            <Header text={'Electronic Mail Apparatus'} />
            <TabContainer />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;

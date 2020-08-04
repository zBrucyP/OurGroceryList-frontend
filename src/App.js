import React from 'react';
import './App.css';
import HeadingBar from './components/HeadingBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LandingPage from './components/LandingPage';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
  palette:{
    primary: {
      light: '#b2fef7',
      main: '#80cbc4',
      dark: '#4f9a94',
      contrastText: '#000000'
    },
    secondary: {
      light: '#c3fdff',
      main: '#90caf9',
      dark: '#5d99c6',
      contrastText: '#000000'
    },
  },
});

function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HeadingBar />
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
          </Switch>
        </ThemeProvider>  
      </Router>
    </div>
  );
}

export default App;

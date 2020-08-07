import React, { useState, useEffect } from 'react';
import './App.css';
import HeadingBar from './components/HeadingBar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Cookies from 'js-cookie';
import { UserContext } from './components/UserContext';

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

  const [user, setUser] = useState({
    fname: '',
    loggedIn: false,
  });

  useEffect(() => { // check for token in cookies
    let isCancelled = false;
    if(!isCancelled) {
      const token_exists = Cookies.get('ogc_token');
      if(token_exists) {
        setUser(state => ({...state, loggedIn: true}));
      }
    }
    return () => isCancelled = true; // fixes Warning: Can't perform a React state update on an unmounted component.
  }, []);


  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={{ user, setUser }}>
            <CssBaseline />
            <HeadingBar />
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </UserContext.Provider>
        </ThemeProvider>  
      </Router>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import HeadingBar from './components/HeadingBar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ListPage from './components/ListPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Cookies from 'js-cookie';
import { UserContext } from './components/UserContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#b6ffff',
      main: '#81d4fa',
      dark: '#4ba3c7',
      contrastText: '#000000',
    },
    secondary: {
      light: '#d7ffd9',
      main: '#a5d6a7',
      dark: '#75a478',
      contrastText: '#000000',
    },
    general: {
      error: '#B00020',
      background: '#FFFFFF',
    },
  },
});

function App() {
  const [user, setUser] = useState({
    fname: '',
    loggedIn: false,
  });

  useEffect(() => {
    // check for token in cookies
    let isCancelled = false;
    if (!isCancelled) {
      const token_exists = Cookies.get('ogc_token');
      if (token_exists) {
        setUser((state) => ({ ...state, loggedIn: true }));
      }
    }
    return () => (isCancelled = true); // fixes Warning: Can't perform a React state update on an unmounted component.
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
              <Route path="/list" component={ListPage} />
            </Switch>
          </UserContext.Provider>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;

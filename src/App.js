import React, { useState, useEffect } from 'react';
import './App.css';
import HeadingBar from './components/HeadingBar/HeadingBar';
import LandingPage from './pages/Home/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Dashboard from './pages/ListDashboard/Dashboard';
import ListPage from './pages/ListDetailsPage/ListPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Cookies from 'js-cookie';
import { UserContext } from './context/UserContext';

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

    useEffect(() => {
        if (user.fname === '') {
            let nameFromCookie = Cookies.get('fname');
            console.log(nameFromCookie);
            if (nameFromCookie) {
                setUser((state) => ({...state, fname: nameFromCookie}));
            }
        }
    }, [user.fname]);

    return (
        <div className="App">
            <Router>
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
            </Router>
        </div>
    );
}

export default App;

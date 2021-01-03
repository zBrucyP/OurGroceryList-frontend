import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './HeadingBar.css';

export default function HeadingBar() {
    const { user, setUser } = useContext(UserContext); // fname, loggedIn

    const [userId, setUserId] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);

    const logo = require('../../img/Logo.svg');

    return (
        <div className="heading-bar">
            <div className="heading-bar-flex-item">
                <div className="heading-bar-logo-item">
                    <img src={logo} className="" />
                </div>
                <div className="heading-bar-logo-item">
                    <Link className="site-header-link" to="/">
                        <div className="site-header">Our Grocery List</div>
                    </Link>
                </div>
            </div>
            <div className="heading-bar-flex-item">
                <div className="heading-bar-nav-item">
                    {user.fname ? (
                        <Typography variant="body1">
                            Hi, {user.fname}!
                        </Typography>
                    ) : (
                        ''
                    )}
                </div>
                <div className="heading-bar-nav-item">
                    {user.loggedIn ? (
                        <button className="">
                            <Link to="/dashboard">Dashboard</Link>
                        </button>
                    ) : (
                        ''
                    )}
                </div>
                <div className="heading-bar-nav-item">
                    {user.loggedIn ? (
                        ''
                    ) : (
                        <button className="heading-button">
                            <Link
                                to="/login"
                                className="button-link button-text"
                            >
                                Login
                            </Link>
                        </button>
                    )}
                </div>
                <div className="heading-bar-nav-item">
                    {user.loggedIn ? (
                        ''
                    ) : (
                        <button className="heading-button signup-button">
                            <Link
                                to="/signup"
                                className="button-link signup-button-text"
                            >
                                Sign up
                            </Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

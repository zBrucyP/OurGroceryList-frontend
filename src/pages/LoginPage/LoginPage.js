import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Joi from 'joi';
import Cookies from 'js-cookie';
import { LinearProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/Utils';
import './LoginPage.css';

const BASE_URL = utils.getBackendBaseURL();

function Copyright() {
    return (
        <p className="copyright">
            {'Copyright © '}
            {
                'Our Grocery List '
            }
            {new Date().getFullYear()}
            {'.'}
        </p>
    );
}

// to validate user input
const schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .required(),

    password: Joi.string().trim().min(8).max(100).required(),
});


export default function SignUp() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toDashboard, setToDashboard] = useState(false);

    useEffect(() => {
        // check for token in cookies
        let isCancelled = false;
        if (!isCancelled) {
            const token_exists = Cookies.get('ogc_token');
            if (token_exists) {
                setToDashboard(true);
            }
        }
        return () => (isCancelled = true); // fixes Warning: Can't perform a React state update on an unmounted component.
    }, []);

    // validates user input data before sending to server
    const inputIsValid = (input) => {
        // reset error message
        setErrorMsg('');

        // validate input with schema
        const validation = schema.validate({
            password: input.password,
            email: input.email,
        });

        // no joi errors, user input is valid
        if (validation.error === undefined) {
            return true;
        } else {
            // user input is not valid
            return false;
        }
    };

    async function submitForm(event) {
        event.preventDefault(); // stop refresh
        setIsLoading(true); // start loading bar
        let isCancelled = false; //

        try {
            if (!isCancelled) {
                // collect data
                const formData = {
                    email: email,
                    password: password,
                };

                // validate data
                if (inputIsValid(formData)) {
                    // post to server, get response
                    const res = await fetch(
                        `${BASE_URL}/auth/login/`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                        },
                    );

                    if (res.ok) {
                        // get response token from server
                        const data = await res.json();
                        Cookies.set('ogc_token', data.token, { expires: 1 });
                        Cookies.set('fname', data.fname, { expires: 1 });
                        Cookies.set('ogcid', data.ogcid, { expires: 1 });
                        setUser({
                            fname: data.fname,
                            loggedIn: true,
                        });
                        setIsLoading(false);
                        setToDashboard(true); // redirect user to dashboard on successful signup
                    } else {
                        console.log(res);
                        setErrorMsg('Email or password is incorrect.2');
                        setIsLoading(false);
                    }
                } else {
                    setErrorMsg('Email or password is incorrect.3');
                    setIsLoading(false);
                }
            }
            return () => (isCancelled = true); // fixes Warning: Can't perform a React state update on an unmounted component.
        } catch (error) {
            setErrorMsg('An unexpected error occurred. Please try again soon.');
            console.log(error);
        }
        setIsLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {toDashboard ? <Redirect to="/dashboard" /> : ''}
                <CssBaseline />
                <div className="">
                    {(isLoading || user.loggedIn) ?
                        <img src="/images/unlock.svg" className="login-img" /> : 
                        <img src="/images/lock.svg" className="login-img" />
                    }
                    <p className="title">
                        Login
                    </p>
                    {errorMsg ? <Alert severity="error" className="login-error-alert">{errorMsg}</Alert> : ''}
                    <form className="" noValidate onSubmit={submitForm}>
                        <div>
                            <div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="field-login"
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    type="password"
                                    autoComplete="current-password"
                                    className="field-login"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="button-login"
                        >
                            Login
                        </button>
                        <div>
                            <Link to="/signup" className="link-create-account">
                                Need to create an account? Sign up now!
                            </Link>
                        </div>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
                {isLoading ? <LinearProgress color="secondary" /> : ''}
            </div>
        </div>
    );
}

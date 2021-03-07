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
import './SignupPage.css';

// base form template from: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up

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

    fname: Joi.string().trim().min(2).max(50).required(),

    password: Joi.string().trim().min(8).max(100).required(),
});


export default function SignUp() {

    const { user, setUser } = useContext(UserContext);

    const [fname, setFName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
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

        // ensure passwords match
        if (input.password.toString() === input.confPass.toString()) {
            // validate input with schema
            const validation = schema.validate({
                fname: input.fname,
                password: input.password,
                email: input.email,
            });

            // no joi errors, user input is valid
            if (validation.error === undefined) {
                return true;
            } else {
                // user input is not valid
                setErrorMsg(
                    'Input does not match requirements:' + validation.error,
                );
                return false;
            }
        } else {
            // passwords did not match
            setErrorMsg('Passwords do not match');
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
                    fname: fname,
                    email: email,
                    password: password,
                    confPass: confirmPass,
                };

                // validate data
                if (inputIsValid(formData)) {
                    // post to server, get response
                    const res = await fetch(
                        'http://localhost:1337/auth/signup/',
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
                        setUser({
                            fname: data.fname,
                            loggedIn: true,
                        });
                        setIsLoading(false);
                        setToDashboard(true); // redirect user to dashboard on successful signup
                    } else if (res.status === 409) {
                        setErrorMsg(
                            'Email is already in use. Please choose a different one or try logging in.',
                        );
                    } else {
                        setErrorMsg(
                            'An error occurred. Please check your entries and try again soon.',
                        );
                    }
                } else {
                    console.log('Input not valid');
                    //return false;
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
        <div className="signup-container">
            <div className="signup-card">
                {toDashboard ? <Redirect to="/dashboard" /> : ''}
                <CssBaseline />
                <div className="">
                    {(isLoading || user.loggedIn) ?
                        <img src="/images/unlock.svg" className="signup-img" /> : 
                        <img src="/images/lock.svg" className="signup-img" />
                    }
                    <p className="title">
                        Sign up
                    </p>
                    {errorMsg ? <Alert severity="error" className="signup-error-alert">{errorMsg}</Alert> : ''}
                    <form className="" noValidate onSubmit={submitForm}>
                        <div>
                            <div>
                                <input
                                    value={fname}
                                    onChange={(e) => setFName(e.target.value)}
                                    required
                                    id="fname"
                                    autoComplete="fname"
                                    placeholder="First Name"
                                    className="field-signup"
                                />
                            </div>
                            <div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    id="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    className="field-signup"
                                />
                            </div>
                            <div>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="field-signup"
                                />
                            </div>
                            <div>
                                <input
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    required
                                    type="password"
                                    id="reEnterPassword"
                                    autoComplete="current-password"
                                    placeholder="Confirm Password"
                                    className="field-signup"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="button-signup"
                        >
                            Sign Up
                        </button>
                        <div>
                            <Link to="/login" className="link-login">
                                Already have an account? Sign in
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

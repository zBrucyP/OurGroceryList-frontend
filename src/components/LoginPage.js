import React, { useState, useEffect, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Joi from 'joi';
import Cookies from 'js-cookie';
import { LinearProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';

// base form template from: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Our Grocery.List
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
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

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(5),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingBottom: theme.spacing(3),
    },
    container: {
        background: 'white',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();

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
                        'http://localhost:1337/auth/login/',
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
                    }
                } else {
                    setErrorMsg('Email or password is incorrect.3');
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
        <Container className={classes.container} component="main" maxWidth="xs">
            {toDashboard ? <Redirect to="/dashboard" /> : ''}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : ''}
                <form className={classes.form} noValidate onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Login
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/signup" variant="body2">
                                Need to create an account? Sign up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
            {isLoading ? <LinearProgress color="secondary" /> : ''}
        </Container>
    );
}

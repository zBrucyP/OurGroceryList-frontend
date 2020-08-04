import React, { useState, useEffect } from 'react';
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
import Joi from 'joi';

// form template from: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up

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
      .email({ tlds: {allow:false} })
      .trim()
      .required(),
  
  fname: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

  password: Joi.string()
      .trim()
      .min(8)
      .max(100)
      .required(),
});

// validates user input data before sending to server
const inputIsValid = (input) => {
  // ensure passwords match
  if(input.password.toString() === input.confPass.toString()) { 
    
    // validate input with schema
    const validation = schema.validate({ 
      fname: input.fname,
      password: input.password,
      email: input.email,
    });

    // no joi errors, user input is valid
    if(validation.error === undefined) {
      return true;
    } 
    else { // user input is not valid
      return false;
    }
  } 
  else { // passwords did not match
    return false;
  }
}

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
    paddingBottom: theme.spacing(3)
  },
  container: {
      background: 'white'
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

  const [fname, setFName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  async function submitForm(event) {
    try {
      // collect data
      const formData = {
        fname: fname,
        email: email,
        password: password,
        confPass: confirmPass
      };
  
      // validate data
      if(inputIsValid(formData)) {
        console.log('input was valid');
      } else{
        return false;
      }
  
      // send to server
  
    } catch (error) {
      console.log(error);
    }
  
    event.preventDefault();
  }

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={fname}
                onChange={(e) => setFName(e.target.value)}
                variant="outlined"
                required
                fullWidth
                id="fname"
                label="First Name"
                name="firstname"
                autoComplete="fname"
              />
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                variant="outlined"
                required
                fullWidth
                name="reEnterPassword"
                label="Confirm Password"
                type="password"
                id="reEnterPassword"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
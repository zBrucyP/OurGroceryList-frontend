import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { UserContext } from './../UserContext';

const useStyles = makeStyles((theme) => ({}));

export default function LandingPage() {
    const styles = useStyles();
    const { user, setUser } = useContext(UserContext);

    return <div>{user.loggedIn ? <Redirect to="/dashboard" /> : ''}</div>;
}

import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function LandingPage() {
    const { user, setUser } = useContext(UserContext);

    return <div>{user.loggedIn ? <Redirect to="/dashboard" /> : ''}</div>;
}

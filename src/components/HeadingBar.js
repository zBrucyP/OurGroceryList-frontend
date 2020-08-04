import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        flexGrow: 1
    },
    appBar: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText, 
        width: '100%'
    },
    typography: {
        align: 'center',
        color: 'inherit',
        flexGrow: 1,  // makes title take up all space between other 2 elmts 
        textDecoration: 'none'
    },
}));

export default function HeadingBar () {
    
    const classes = useStyles();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);

    useEffect ( () => {
        
    }, [loggedIn]);


    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Link className={classes.typography} to="/">
                        <Typography variant="h5" className={classes.typography}>Our Grocery.List</Typography>
                    </Link>
                    <Button color="inherit"><Link to="/login">Login</Link></Button>
                    <Button color="inherit"><Link to="/signup">Sign up</Link></Button>
                    {loggedIn ? 
                        <Avatar src={userAvatar}/>
                        :
                        <Avatar />
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}
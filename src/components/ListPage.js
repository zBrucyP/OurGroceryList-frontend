import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { fade } from '@material-ui/core/styles/colorManipulator';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Redirect } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        flexGrow: 1
    },

    container: {
        marginTop: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        background: fade(theme.palette.secondary.light, .5),
    },

    toolbar: {
        width: '100%',
        display: 'flex',
        background: fade(theme.palette.secondary.main, .85),
    },

    mainContentContainer: {
        width: '100%',
        padding: '3%',
    },

    typography: {
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
    },

    typography_toolbar_header: {
        flexGrow: 1,
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
        fontSize: '200%'
    },

    typography_header: {
        flexGrow: 1,
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
        fontSize: '130%'
    },

    icon: {
        align: 'right',
        fontSize: '200%',
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.dark,
        }
    },
    
    card: {
        cursor: 'pointer',
    }
}));


export default function ListPage() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext);

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toDashboard, setToDashboard] = useState(false);


    useEffect(() => {
        // @todo: get query param and get list data
    }, []);

    return (
        <div className={classes.container}>
            { toDashboard ? <Redirect to='/dashboard' />: "" }
            <div className={classes.toolbar}>
                {isLoading ? <LinearProgress/> : ""}
                <ArrowBackIcon onClick={() => setToDashboard(!toDashboard)} className={classes.icon}></ArrowBackIcon>
                <Typography className={classes.typography_toolbar_header}>Your Lists</Typography>
                <EditIcon onClick={() => setEditMode(!editMode)} className={classes.icon}></EditIcon>
            </div>
            <div className={classes.mainContentContainer}>

            </div>
        </div>
    )
}
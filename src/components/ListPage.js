import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { fade } from '@material-ui/core/styles/colorManipulator';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';


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

const LISTS_API_URL = 'http://localhost:1337/api/lists/list/';

export default function ListPage() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext);

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toDashboard, setToDashboard] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [listData, setListData] = useState(null);


    useEffect(() => {
        // Gets query parameter 'id' and makes initial request for list data
        const fetch_list_data = async () => {
            try{
                // get id from query param 'id'
                let search = window.location.search;
                let params = new URLSearchParams(search);
                let list_id = params.get('id');

                // get token for api call
                const token = Cookies.get('ogc_token');
                if(token === undefined) {
                    Cookies.remove('ogc_token');
                    setUser(state => ({...state, loggedIn: false}));
                }
                
                // if id of list was found in url query params
                if(list_id) {
                    const res = await fetch(`${LISTS_API_URL}?list_id=${list_id}`, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`
                        },
                    });

                    if(res.ok) {
                        const data = await res.json();
                        setListData(data);
                    } else {
                        setErrorMsg('Server responded with unknown error. Please try reopening the list');
                    }
                } else {
                    console.log('unable to find id');
                    setToDashboard(true);
                }
            } catch(error) {
                console.log(error);
            }
        }
        fetch_list_data();
    }, []);

    return (
        <div className={classes.container}>
            { toDashboard ? <Redirect to='/dashboard' />: "" }
            <div className={classes.toolbar}>
                { user.loggedIn ? "" : <Redirect to='/login'/> }
                {isLoading ? <LinearProgress/> : ""}
                <ArrowBackIcon onClick={() => setToDashboard(!toDashboard)} className={classes.icon}></ArrowBackIcon>
                <Typography className={classes.typography_toolbar_header}>{listData ? listData.name : ''}</Typography>
                <EditIcon onClick={() => setEditMode(!editMode)} className={classes.icon}></EditIcon>
            </div>
            <div className={classes.mainContentContainer}>

            </div>
        </div>
    )
}
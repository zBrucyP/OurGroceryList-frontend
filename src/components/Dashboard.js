import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Cookies from 'js-cookie';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        flexGrow: 1
    },

    dashboard: {
        marginTop: '5%',
        marginLeft: '5%',
        marginRight: '5%',
        background: fade(theme.palette.secondary.light, .5),
    },

    dashBoardToolbar: {
        width: '100%',
        background: fade(theme.palette.secondary.main, .85),
    },

    grid: {
        width: '50%',
        padding: '3%',
    },

    typography: {
        align: 'center',
        color: 'inherit',
        textDecoration: 'none'
    },
}));


export default function Dashboard() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext); // fname, loggedIn
    
    const [isLoading, setIsLoading] = useState(false);
    const [toLogin, setToLogin] = useState(false);

    useEffect(() => {

    }, []);

    // from data, creates cards of data to fill grid
    function generateGridOfCards() {
        
    }

    return(
        <div className={classes.dashboard}>
            {toLogin ? <Redirect to='/login'/> : ""}
            <div className={classes.dashBoardToolbar}>
                {isLoading ? <LinearProgress/> : ""}
                g
            </div>
            <Grid container className={classes.grid} spacing={5}>
                <Grid item xs>
                    <Card>
                        <CardContent>
                            <Typography className={classes.typography} gutterBottom>
                                list 1
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card>
                        <CardContent>
                            <Typography className={classes.typography} gutterBottom>
                                list 2
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
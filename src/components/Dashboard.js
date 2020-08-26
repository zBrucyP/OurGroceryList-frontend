import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import Joi from 'joi';


const schema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(40)
        .trim()
        .required()
});

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
        display: 'flex',
        background: fade(theme.palette.secondary.main, .85),
    },

    grid: {
        width: '50%',
        padding: '3%',
    },

    typography: {
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
    },

    typography_header: {
        flexGrow: 1,
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
        fontSize: '150%'
    },

    icon: {
        align: 'right',
        fontSize: '200%',
        '&:hover': {
            color: theme.palette.primary.dark,
        }
    }
}));


export default function Dashboard() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext); // fname, loggedIn
    
    const [isLoading, setIsLoading] = useState(false);
    const [newListDialogOpen, setNewListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {

    }, []);

    // from data, creates cards of data to fill grid
    function generateGridOfCards() {
        console.log('in generate');
    }

    const handleNewListDialogClickOpen = () => {
        setNewListDialogOpen(true);
    };

    const handleNewListDialogClose = () => {
        setNewListDialogOpen(false);
    };

    async function handleAddNewList() {
        setIsLoading(true);

        // get token for api call
        const token = Cookies.get('ogc_token');
        if(token === undefined) {
            setUser(state => ({...state, loggedIn: false}));
            console.log('token undefined')
        } 

        try {
            const validation = schema.validate({
                name: newListName
            })

            if(validation.error === undefined) {

                const listData = {
                    listName: newListName
                }

                const res = await fetch('http://localhost:1337/api/lists/newlist/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(listData)
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                } else if (res.status === 498) {
                    Cookies.remove('ogc_token');
                    setUser(state => ({...state, loggedIn: false}));
                } else {
                    console.log(res);
                }
            } else {
                setErrorMsg('List name is not acceptable.');
            }
            
        } catch(error) {
            console.log(error);
        }

        handleNewListDialogClose();
        setIsLoading(false);
    }

    return(
        <div className={classes.dashboard}>
            <Dialog open={newListDialogOpen} onClose={handleNewListDialogClose}>
                <DialogTitle className={classes.typography_header}>New List</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of your list:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="listName"
                        label="List Name"
                        fullWidth
                        onChange={(e) => setNewListName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewListDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewList} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            {user.loggedIn ? "" : <Redirect to='/login'/>}
            <div className={classes.dashBoardToolbar}>
                {isLoading ? <LinearProgress/> : ""}
                <Typography className={classes.typography_header}>Your Lists</Typography>
                <AddIcon onClick={handleNewListDialogClickOpen} className={classes.icon}></AddIcon>
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
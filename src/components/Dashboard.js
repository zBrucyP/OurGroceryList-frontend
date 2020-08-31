import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Cookies from 'js-cookie';
import Joi from 'joi';


const schema = Joi.object({
    name: Joi.string()
        .min(2)
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
        width: '100%',
        padding: '3%',
    },

    typography: {
        align: 'center',
        color: 'inherit',
        textDecoration: 'none',
        fontSize: '80%',
    },

    typography_dashboard_header: {
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


export default function Dashboard() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext); // fname, loggedIn
    
    const [isLoading, setIsLoading] = useState(false);
    const [newListDialogOpen, setNewListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescrip, setNewListDescrip] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [lists, setLists] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [routeListID, setRouteListID] = useState('');
    const [toListPage, setToListPage] = useState(false);

    // from data, creates cards of data to fill grid
    const gridOfCards = () => {
        const cards = lists.map((list, index) =>
            <Grid item xs key={index}>
                <Card className={classes.card} id={list._id} onClick={handleListClick}>
                    <CardContent>
                        {editMode ? <RemoveCircleIcon id={list._id} onClick={handleDeleteList} className={classes.icon}></RemoveCircleIcon> : ""}
                        <Typography className={classes.typography_header} gutterBottom>
                            {list.name}
                        </Typography>
                        <Typography className={classes.typography} gutterBottom>
                            {list.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
        return cards;
    };

    function handleListClick(event) {
        setRouteListID(event.currentTarget.id);
        setToListPage(true);
    }

    async function handleDeleteList(event) { 
        // get token for api call
        const token = Cookies.get('ogc_token');
        if(token === undefined) {
            Cookies.remove('ogc_token');
            setUser(state => ({...state, loggedIn: false}));
        }
        const id_list_to_delete = { 
            list_id: event.currentTarget.id
        }; 

        try {
            const res = await fetch('http://localhost:1337/api/lists/deleteList/', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(id_list_to_delete)
            });

            if(res.ok) {
                setErrorMsg('List deleted!');
                getLists();
            } else if (res.status === 498) {
                Cookies.remove('ogc_token');
                setUser(state => ({...state, loggedIn: false}));
            } else {
                setErrorMsg('Unable to delete list. Please try again.');
            }
        } catch(error) {
            console.log(error);
            setErrorMsg('An error occurred. Please try again.');
        }
    };

    const handleNewListDialogClickOpen = () => {
        setNewListDialogOpen(true);
    };

    const handleNewListDialogClose = () => {
        setNewListDialogOpen(false);
    };

    async function getLists() {
        setIsLoading(true);
        
        // get token for api call
        const token = Cookies.get('ogc_token');
        if(token === undefined) {
            Cookies.remove('ogc_token');
            setUser(state => ({...state, loggedIn: false}));
        }
        try {
            const res = await fetch('http://localhost:1337/api/lists/getAll/', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });
            
            if(res.ok) {
                const data = await res.json();
                setLists(data);
            } else if (res.status === 498) {
                Cookies.remove('ogc_token');
                setUser(state => ({...state, loggedIn: false}));
            } else {
                setErrorMsg('Unable to get current lists');
            }
        } catch(error) {
            console.log(error);
            setErrorMsg('An unknown error occurred. Please try again.');
        }

        setIsLoading(false);
    }

    async function handleAddNewList() {
        setIsLoading(true);

        // get token for api call
        const token = Cookies.get('ogc_token');
        if(token === undefined) {
            Cookies.remove('ogc_token');
            setUser(state => ({...state, loggedIn: false}));
        }
        try {
            const validation = schema.validate({
                name: newListName
            })

            if(validation.error === undefined) {

                const listData = {
                    listName: newListName,
                    listDescrip: newListDescrip
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
                    setErrorMsg(`${newListName} added!`);
                    getLists();
                } else if (res.status === 498) {
                    Cookies.remove('ogc_token');
                    setUser(state => ({...state, loggedIn: false}));
                } else {
                    setErrorMsg('Unable to add list. Please try again.');
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

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if(errorMsg){
            let timer = setTimeout(() => {
                setErrorMsg('');
            }, 10000);
        }
    }, [errorMsg])

    return(
        <div className={classes.dashboard}>
            <CssBaseline />
            {errorMsg? <Alert severity="info">{errorMsg}</Alert> : ""}
            <Dialog open={newListDialogOpen} onClose={handleNewListDialogClose}>
                <DialogTitle className={classes.typography_header}>New List</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name and description of your list:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="listName"
                        label="List Name"
                        fullWidth
                        onChange={(e) => setNewListName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="listDescrip"
                        label="List Description"
                        fullWidth
                        onChange={(e) => setNewListDescrip(e.target.value)}
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
            { user.loggedIn ? "" : <Redirect to='/login'/> }
            { toListPage ? <Redirect to={`/list?id=${routeListID}`} /> : "" }
            <div className={classes.dashBoardToolbar}>
                {isLoading ? <LinearProgress/> : ""}
                <Typography className={classes.typography_dashboard_header}>Your Lists</Typography>
                <EditIcon onClick={() => setEditMode(!editMode)} className={classes.icon}></EditIcon>
                <AddIcon onClick={handleNewListDialogClickOpen} className={classes.icon}></AddIcon>
            </div>
            <Grid container className={classes.grid} spacing={5}>
                {gridOfCards()}
            </Grid>
        </div>
    );
}
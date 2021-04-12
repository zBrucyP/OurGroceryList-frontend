import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Redirect } from 'react-router-dom';
import ListCard from '../../components/ListCard/ListCard';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Cookies from 'js-cookie';
import Joi from 'joi';
import './Dashboard.css';


const schema = Joi.object({
    name: Joi.string().min(2).max(40).trim().required(),
});

//TODO: Rewrite this entire component
export default function Dashboard() {
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
        return lists.map((list, index) => (
            <ListCard 
                key={index}
                id={list.id}
                listName={list.name}
                listDescription={list.description}
                editMode={editMode}
                onCardClick={handleListClick}
                onDeleteListClick={handleDeleteList}
            />
        ));
    };

    function handleListClick(event) {
        if(!editMode) {
            setRouteListID(event.currentTarget.id);
            setToListPage(true);
        }
    }

    async function handleDeleteList(event) {
        // get token for api call
        const token = Cookies.get('ogc_token');
        if (token === undefined) {
            Cookies.remove('ogc_token');
            setUser((state) => ({ ...state, loggedIn: false }));
        }

        console.log(event.currentTarget.id);
        const id_list_to_delete = {
            list_id: event.currentTarget.id,
        };

        try {
            const res = await fetch(
                'http://localhost:1337/api/lists/deleteList',
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(id_list_to_delete),
                },
            );

            if (res.ok) {
                setErrorMsg('List deleted!');
                getLists();
            } else if (res.status === 498) {
                Cookies.remove('ogc_token');
                setUser((state) => ({ ...state, loggedIn: false }));
            } else {
                setErrorMsg('Unable to delete list. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setErrorMsg('An error occurred. Please try again.');
        }
    }

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
        if (token === undefined) {
            Cookies.remove('ogc_token');
            setUser((state) => ({ ...state, loggedIn: false }));
        }
        try {
            const res = await fetch('http://localhost:1337/api/lists/getAll', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setLists(data.payload);
            } else if (res.status === 498) {
                Cookies.remove('ogc_token');
                Cookies.remove('fname');
                setUser((state) => ({ ...state, loggedIn: false }));
            } else {
                setErrorMsg('Unable to get current lists');
            }
        } catch (error) {
            console.log(error);
            setErrorMsg('An unknown error occurred. Please try again.');
        }

        setIsLoading(false);
    }

    async function handleAddNewList() {
        setIsLoading(true);

        // get token for api call
        const token = Cookies.get('ogc_token');
        if (token === undefined) {
            Cookies.remove('ogc_token');
            setUser((state) => ({ ...state, loggedIn: false }));
        }
        try {
            const validation = schema.validate({
                name: newListName,
            });

            if (validation.error === undefined) {
                const listData = {
                    name: newListName,
                    description: newListDescrip,
                };

                const res = await fetch(
                    'http://localhost:1337/api/lists/newlist/',
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(listData),
                    },
                );

                if (res.ok) {
                    const data = await res.json();
                    setErrorMsg(`${newListName} added!`);
                    getLists();
                } else if (res.status === 498) {
                    Cookies.remove('ogc_token');
                    setUser((state) => ({ ...state, loggedIn: false }));
                } else {
                    setErrorMsg('Unable to add list. Please try again.');
                }
            } else {
                setErrorMsg('List name is not acceptable.');
            }
        } catch (error) {
            console.log(error);
        }

        handleNewListDialogClose();
        setIsLoading(false);
    }

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if (errorMsg) {
            let timer = setTimeout(() => {
                setErrorMsg('');
            }, 10000);
        }
    }, [errorMsg]);

    return (
        <div className="dashboard">
            {errorMsg ? <Alert severity="info">{errorMsg}</Alert> : ''}
            <Dialog open={newListDialogOpen} onClose={handleNewListDialogClose}>
                <DialogTitle className="">
                    New List
                </DialogTitle>
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
                    <button onClick={handleNewListDialogClose}>
                        Cancel
                    </button>
                    <button onClick={handleAddNewList}>
                        Add
                    </button>
                </DialogActions>
            </Dialog>
            {user.loggedIn ? '' : <Redirect to="/login" />}
            {toListPage ? <Redirect to={`/list?id=${routeListID}`} /> : ''}
            <div className="dashboard-header">
                <div className="dashboard-title-container">
                    <p className="dashboard-title">
                        My Lists
                    </p>
                </div>
                <div className="dashboard-icons-container">
                    <img 
                        onClick={() => setEditMode(!editMode)} 
                        src="/images/icon-edit.svg"
                        className="icon-add-edit"
                    />
                    <img 
                        onClick={handleNewListDialogClickOpen} 
                        src="/images/icon-add.svg"
                        className="icon-add-edit"
                    />
                </div>
            </div>
            <div className="dashboard-body">
                {isLoading ? <LinearProgress /> : ''}
                <div className="list-card-holder">{gridOfCards()}</div>
            </div>
        </div>
    );
}

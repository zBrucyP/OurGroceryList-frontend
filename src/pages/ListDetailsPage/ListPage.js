import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Redirect, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ListTableRow from '../../components/ListTableRow/ListTableRow';
import './ListPage.css';


function createData(name, bought, price) {
    return { name, bought, price };
}

const LISTS_API_URL = 'http://localhost:1337/api/lists';

export default function ListPage() {
    const { user, setUser } = useContext(UserContext);

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toDashboard, setToDashboard] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [listName, setListName] = useState('');
    const [listItems, setListItems] = useState(null);
    const [listItemsToAdd, setListItemsToAdd] = useState([]);
    const [listItemsToUpdate, setListItemsToUpdate] = useState([]);
    const [addItemObject, setAddItemObject] = useState({
        name: '',
        bought: false,
        price: 0,
    });

    const rows = () => {
        if(listItems){
            return listItems.map((listItem, index) => (
                <ListTableRow 
                    key={index}
                    itemIndex={index}
                    id={listItem.id}
                    listItem={listItem}
                />
            ))
        }
    }

    const headers = [
        "Bought?",
        "Name",
        "Price",
        "Quantity",
        "Description"
    ];

    const handleAddItem = async (event) => {
        setAddItemObject(null);

        try {
            // @todo: add security check on backend so user cannot just change any list by changing url
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let list_id = params.get('id');

            // get token for api call
            const token = Cookies.get('ogc_token');
            if (token === undefined) {
                Cookies.remove('ogc_token');
                setUser((state) => ({ ...state, loggedIn: false }));
            }

            if (list_id) {
                const res = await fetch(
                    `${LISTS_API_URL}/addListItem?list_id=${list_id}`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(addItemObject),
                    },
                );

                if (res.ok) {
                    setErrorMsg('Item added!');
                    fetch_list_data();
                }
            } else {
                console.log('unable to find id');
                setToDashboard(true);
            }

            setAddItemObject(null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetAddItemName = (event) => {
        const name = event.target.value;
        setAddItemObject((state) => ({ ...state, name: name }));
    };

    const fetch_list_data = async () => {
        try {
            // get id from query param 'id'
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let list_id = params.get('id');

            // get token for api call
            const token = Cookies.get('ogc_token');
            if (token === undefined) {
                Cookies.remove('ogc_token');
                setUser((state) => ({ ...state, loggedIn: false }));
            }

            const list_payload = {
                id: list_id,
            };

            // if id of list was found in url query params
            if (list_id) {
                const res = await fetch(`${LISTS_API_URL}/listDetails`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(list_payload),
                });

                if (res.ok) {
                    const data = await res.json();
                    setListName(data.payload.name);
                    setListItems(data.payload.items);
                } else {
                    setErrorMsg(
                        'Server responded with unknown error. Please try reopening the list',
                    );
                }
            } else {
                console.log('unable to find id');
                setToDashboard(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Gets query parameter 'id' and makes initial request for list data
        fetch_list_data();
    }, []);

    return (
        <div className="list-container">
            {toDashboard ? <Redirect to="/dashboard" /> : ''}
            <div className="">
                {user.loggedIn ? '' : <Redirect to="/login" />}
                {isLoading ? <LinearProgress /> : ''}
            </div>
            <div className="container-header">
                <div className="title-container">
                    <p className="list-title">
                        {listName}
                    </p>
                </div>
                <div className="controls-container">
                    <button className="button-save">
                        Save
                    </button>
                    <img 
                        src="/images/icon-add.svg"
                        className="icon"
                    />
                </div>
            </div>
            <div className="rows-container">
                {rows()}
            </div>
        </div>
    );
}



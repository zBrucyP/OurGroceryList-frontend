import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Redirect, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ListTableRow from '../../components/ListTableRow/ListTableRow';
import Utils from '../../utils/Utils';
import ListService from '../../service/ListService';
import './ListPage.css';

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
    const [listId, setListId] = useState('');

    const rows = () => {
        if(listItems){
            return listItems.map((listItem, index) => (
                <ListTableRow 
                    key={index}
                    itemIndex={index}
                    id={listItem.id}
                    listItem={listItem}
                    handleChange={handleListItemChange}
                />
            ))
        }
    }

    // Accepts change details from child element to update listItems
    function handleListItemChange(listItemIndex, field, newValue) {
        let items = [...listItems]; // shallow copy
        let item = {...items[listItemIndex]}; // pull item from listItems
        item[field] = newValue; // update value
        item.isItemToUpdate = item.isItemToAdd ? false : true; // flag item for update if not already flagged to add
        items[listItemIndex] = item; // update shallow copy
        setListItems(items); // update state with shallow copy
    }

    const handleAddItem = (event) => {
        let newItem = {
            list_id: listId,
            isItemToAdd: true,
        }
        let items = [...listItems];
        items = [...items, Utils.generateListItem(newItem)];
        setListItems(items);
    };
    
    // Send any items to be added and updated to service
    async function handleSaveButtonClick() {
        setIsLoading(true);
        let result = {
            addResponse: null,
            updateResponse: null,
        }
        if (listItemsToAdd.length>0){
            result.addResponse = await ListService.addListItems(listItemsToAdd);
            if (result.addResponse.success) listItems.map(item => item.isItemToAdd = false); // remove any items from the add list
        }
        if (listItemsToUpdate.length>0) {
            let updateItemsResponse = await ListService.updateListItems(listItemsToUpdate);
        } 
        setIsLoading(false);
        if (!result.addResponse && !result.updateResponse) setErrorMsg('Everything is already saved!');
        //TODO: Finish this
    }

    const findListId = async () => {
        try {
            // get id from query param 'id'
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let listIdFromURL = params.get('id');
            setListId(listIdFromURL);
        } catch (error) {
            console.log('Unable to find list ID');
            setToDashboard(true);
        }
    }

    const fetch_list_data = async () => {
        try {
            // get id from query param 'id'
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let list_id = params.get('id');

            // get token for api call
            const token = Cookies.get('ogc_token');
            if (token === undefined) {
                user.requestLogout();
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
                    setListItems(Utils.mapToArrayOfListItem(data.payload.items));
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
        findListId();
        fetch_list_data();
    }, []);

    useEffect(() => {
        if(listItems) {
            setListItemsToAdd(listItems.filter(item => item.isItemToAdd));
            setListItemsToUpdate(listItems.filter(item => item.isItemToUpdate));
        }
    }, [listItems]);

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
                    <button 
                        className="button-save"
                        onClick={handleSaveButtonClick}
                    >
                        Save
                    </button>
                    <img 
                        src="/images/icon-add.svg"
                        className="icon"
                        onClick={handleAddItem}
                    />
                </div>
            </div>
            <div className="rows-container">
                {rows()}
            </div>
        </div>
    );
}



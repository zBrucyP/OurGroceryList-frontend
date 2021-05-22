import Cookies from 'js-cookie';
import Response from './../models/Response';

const LISTS_BASE_URL = 'http://localhost:1337/api/lists';
const LISTS_ADDLISTITEMS = '/addListItems';
const LISTS_UPDATELISTITEMS = '/updateListItems';


function getJWTFromCookie() {
    return Cookies.get('ogc_token');
}

const addListItems = async (items) => {
    const response = new Response();
    const token = getJWTFromCookie();
    if(!token) {
        response.loginExpired = true;
        return response;
    };
    const bodyObject = {
        listItems: items,
    }
    try {
        const res = await fetch(
            `${LISTS_BASE_URL}${LISTS_ADDLISTITEMS}`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyObject)
            }
        );
        response.status = res.status; 
        if (res.ok) {
            const data = await res.json();
            response.data = data.payload;
            response.success = true;
        } else if (res.status === 498) {
            response.loginExpired = true;
        } else {
            const data = await res.json();
            response.errorMessages.push(data.errorMessage);
        }
    } catch (error) {
        console.log(error);
        response.errorMessages.push('An unknown error occurred.');
    }
    return response;
}

const updateListItems = async (items) => {
    const response = new Response();
    const token = getJWTFromCookie();
    if(!token) {
        response.loginExpired = true;
        return response;
    };
    const bodyObject = {
        listItems: items,
    }

    try {
        const res = await fetch(
            `${LISTS_BASE_URL}${LISTS_UPDATELISTITEMS}`,
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyObject)
            }
        );
        response.status = res.status; 
        if (res.ok) {
            const data = await res.json();
            response.data = data.payload;
            response.success = true;
        } else if (res.status === 498) {
            response.loginExpired = true;
        } else {
            const data = await res.json();
            response.errorMessages.push(data.errorMessage);
        }
    } catch (error) {
        console.log(error);
        response.errorMessages.push('An unknown error occurred.');
    }

    return response;
}

export default {
    addListItems,
    updateListItems,
}
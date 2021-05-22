import constants from '../utils/constants';


// accepts response from /listDetails and returns list of ListItem
function mapToArrayOfListItem(items) {
    var arrListItems = items.map(item => {
        return generateListItem(item);
    }); 

    return arrListItems;
}

function generateListItem(item) {
    const listItem = {
        id: item.id ? item.id : null,
        list_id: item.list_id ? item.list_id : null,
        name: item.name ? item.name : '',
        description: item.description ? item.description : '',
        price: item.price ? item.price : 0,
        quantity: item.quantity ? item.quantity : 0,
        bought: item.bought ? item.bought : false,
        isItemToAdd: item.isItemToAdd? item.isItemToAdd : false,
        isItemToUpdate: item.isItemToUpdate? item.isItemToUpdate : false,
        isItemToDelete: item.isItemToDelete? item.isItemToDelete : false,
    }
    return listItem;
}

function getBackendBaseURL() {
    if (process.env.NODE_ENV === 'production') {
        return constants.OURGROCERYLISTAPI_PRODUCTION;
    }
    else {
        return constants.OURGROCERYLISTAPI_DEVELOPMENT;
    }
}

export default {
    mapToArrayOfListItem,
    generateListItem,
    getBackendBaseURL
}
import ListItem from './../models/ListItem';

// accepts response from /listDetails and returns list of ListItem
function mapToArrayOfListItem(items) {
    var arrListItems = items.map(item => {
        const listItem = new ListItem(
            item.id,
            item.list_id,
            item.name,
            item.description,
            item.price,
            item.quantity,
            item.bought
        );
        return listItem;
    }); 

    return arrListItems;
}

export default {
    mapToArrayOfListItem
}
export default class ListItem {
    constructor(id, listId, name, description, price, quantity, bought) {
        this.id = id? id : null;
        this.listId = listId? listId : null;
        this.name = name? name : null;
        this.description= description? description : null;
        this.price= price? price : null;
        this.quantity = quantity? quantity : null;
        this.bought = bought? bought: false;
        this.isItemToAdd = false;
        this.isItemToUpdate = false;
        this.isItemToDelete = false;
    }
}
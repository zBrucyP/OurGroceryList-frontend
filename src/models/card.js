export default class card {
    constructor(id, imagePath, text, description, onClick) {
        this.id = id? id : null;
        this.imagePath = imagePath? imagePath : null;
        this.text = text? text: null;
        this.description = description? description : null;
        this.onClick = onClick? onClick : null;
    }
}
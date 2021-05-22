export default class Response {
    constructor() {
        this.success = false;
        this.statusCode = 0;
        this.errorMessages = [];
        this.loginExpired = false;
        this.data = null;
    }
}
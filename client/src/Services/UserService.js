import FetchService from "./FetchService";

export default class UserService {
    constructor() {
        this.fetcher = new FetchService();
    }

    async loadUserByUsername(username) {
        return await this.fetcher.getUserByUsername(username);
    }
}
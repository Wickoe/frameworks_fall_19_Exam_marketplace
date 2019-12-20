import FetchService from "./FetchService";

export default class AuthenticationService {
    constructor() {
        this.fetcher = new FetchService();
    }

    async createAccount(userCredentials) {
        if (!this.validUserCredentials(userCredentials)) {
            return {error: 1, msg: "Please enter required input fields! (Denoted by the '*' (Asterisk))"}
        }

        userCredentials["admin"] = userCredentials["userGroup"] === "admin";

        const userCreationResponse = await this.fetcher.postUser(userCredentials);

        return userCreationResponse;
    }

    async authenticateUser(userCredentials) {
        const userAuthResponse = await this.fetcher.authenticateUser(userCredentials);

        if (!userAuthResponse["error"]) {
            this.setToken(userAuthResponse["token"]);
            this.setUsername(userCredentials["username"]);
            this.setAdmin(userAuthResponse["admin"]);
            this.setUserId(userAuthResponse["id"]);

            userAuthResponse["username"] = userCredentials["username"];
        }

        return userAuthResponse;
    }

    logoutUser() {
        this.setUsername("");
        this.setToken("");
        this.setAdmin("");
    }

    authenticatedUser() {
        const username = this.getUsername(),
            token = this.getToken();

        return username !== null && username.length > 0 && token !== null && token.length > 0
    }

    loadUserCredentials() {
        return {username: this.getUsername(), token: this.getToken(), admin: Boolean(this.getAdmin())};
    }

    getToken() {
        return localStorage.getItem("token");
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    getAdmin() {
        return localStorage.getItem("admin");
    }

    setAdmin(admin) {
        localStorage.setItem("admin", admin);
    }

    getUserId() {
        return localStorage.getItem("userId");
    }

    setUserId(userId) {
        localStorage.setItem("userId", userId);
    }

    validUserCredentials(userCredentials) {
        try {
            const username = userCredentials["username"],
                password = userCredentials["password"],
                userGroup = userCredentials["userGroup"];

            return username !== undefined && username.length > 0 &&
                password !== undefined && password.length >= 8 &&
                userGroup !== undefined && (userGroup === 'admin' || userGroup === 'user');
        } catch (e) {
            return false;
        }
    }

    authHeader() {
        return {"Authorization": `Bearer ${this.getToken()}`};
    }

    authenticatedUserIsAdmin() {
        try {
            return this.getAdmin() !== "false";
        } catch (e) {
            return false;
        }
    }

    authenticatedUserPage(userPage) {
        return this.authenticatedUserIsAdmin() && this.getUserId() === userPage["_id"];
    }
}
import FetchService from "./FetchService";

export default class AuthenticationService {
    constructor() {
        this.fetcher = new FetchService();
    }

    async createAccount(userCredentials) {
        if (!this.validUserCredentials(userCredentials)) {
            return {error: 1, msg: "Please enter an input for all required input fields!"}
        }

        userCredentials["admin"] = userCredentials["userGroup"] === "admin";

        const userCreationResponse = await this.fetcher.postUser(userCredentials);

        if (userCreationResponse["error"]) {
            return {error: 1, msg: "An error occurred while trying to create user account. Please try again later!"}
        }

        return userCreationResponse;
    }

    async authenticateUser(userCredentials) {
        const userAuthResponse = await this.fetcher.authenticateUser(userCredentials);

        if (!userAuthResponse["error"]) {
            this.setToken(userAuthResponse["token"]);
            this.setUsername(userCredentials["username"]);
            this.setAdmin(userAuthResponse["admin"]);

            userAuthResponse["username"] = userCredentials["username"];
        }

        return userAuthResponse;
    }

    logoutUser() {
        this.setUsername("");
        this.setToken("");
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

    getUsername() {
        return localStorage.getItem("username");
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    setAdmin(admin) {
        localStorage.setItem("admin", admin);
    }

    getAdmin() {
        return localStorage.getItem("admin");
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
            const admin = this.getAdmin();

            if(admin === "false") {
                return false
            } else {
                return true;
            }

            // return Boolean(this.getAdmin());
        } catch (e) {
            return false;
        }
    }
}
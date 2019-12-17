import AuthenticationService from "./AuthenticationService";

export default class FetchService {
    async fetch(path, pathArgument = "", method = 'GET', payload, header = {}) {
        const headers = {"Content-type": "application/json; charset=UTF-8", ...header};

        const webResponse = await fetch(`${path}/${pathArgument}`, {
            method: method,
            body: JSON.stringify(payload),
            headers: headers
        });

        const webResponseStatus = webResponse["status"];

        const data = await webResponse.json();

        const error = (webResponseStatus !== 200 || webResponseStatus !== 304 || data["error"]) ? 0: 1;

        return {msg: data["msg"], error: error, data: data, webStatus: webResponseStatus};
    }

    async postUser(userCredentials) {
        const postUserApi = (process.env.REACT_POST_USER_API || 'http://localhost:8080/api/users');

        return this.fetch(postUserApi, "", 'POST', userCredentials);
    }

    async authenticateUser(userCredentials) {
        const authenticateUserApi = (process.env.REACT_AUTHENTICATE_USER_API || 'http://localhost:8080/api/users/authenticate');

        const webResponse = await this.fetch(authenticateUserApi, "", 'POST', userCredentials);

        webResponse["admin"] = webResponse["data"]["admin"];
        webResponse["token"] = webResponse["data"]["token"];

        delete webResponse["data"];

        return webResponse;
    }

    async postCategory(category) {
        const postCategoryApi = (process.env.REACT_POST_CATEGORY_API || 'http://localhost:8080/api/categories');

        const authService = new AuthenticationService();

        const webResponse = await this.fetch(postCategoryApi, "", 'POST', category, authService.authHeader());

        webResponse["category"] = webResponse["data"]["data"];
        // TODO - if anything is needed while 'actual' web response is still accessible

        delete webResponse["data"];

        return webResponse;
    }

    async loadCategories() {
        const fetchCategories = (process.env.REACT_POST_CATEGORY_API || 'http://localhost:8080/api/categories');

        const webResponse = await this.fetch(fetchCategories);

        webResponse["categories"] = webResponse["data"]["categories"];

        delete webResponse["data"];

        return webResponse;
    }

    async loadCategoryBooks(categoryId) {
        const fetchCategoryBooks = (process.env.REACT_POST_CATEGORY_API || 'http://localhost:8080/api/books');

        const webResponse = await this.fetch(fetchCategoryBooks, categoryId);

        if(webResponse["error"]) {
            return [];
        }

        return webResponse["data"]["books"];
    }
}
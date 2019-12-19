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
        const fetchCategoryBooks = (process.env.REACT_POST_CATEGORY_API || 'http://localhost:8080/api/categories');
        const pathArgument = `${categoryId}/books`;

        const webResponse = await this.fetch(fetchCategoryBooks, pathArgument);

        if(webResponse["error"]) {
            return [];
        }

        return webResponse["data"];
    }

    async postBook(book) {
        const postBookApi = (process.env.REACT_POST_BOOK_API || 'http://localhost:8080/api/books');
        const authHeader = new AuthenticationService().authHeader();

        const webResponse = await this.fetch(postBookApi, "", 'POST', book, authHeader);

        if(webResponse["error"]) {
            return webResponse;
        }

        if(webResponse["status"] === 401) {
            return {error: 2, msg: "Please login in order to post a book for sale!"}
        }

        webResponse["book"] = webResponse["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async getCategoryId(category) {
        const getCategoryId = (process.env.REACT_GET_CATEGORY_ID || 'http://localhost:8080/api/categories/categoryId');

        const webResponse = await this.fetch(getCategoryId, "", 'POST', {category: category});

        if(webResponse["error"]) {
            return webResponse;
        }

        return webResponse["data"];
    }

    async getCategory(categoryId) {
        const categoryApi = (process.env.REACT_CATEGORY_API || 'http://localhost:8080/api/categories');

        const webResponse = await this.fetch(categoryApi, categoryId);

        if(webResponse["error"]) {
            return {msg: webResponse["msg"], error: webResponse["error"], category: {}};
        }

        webResponse["category"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async bookExists(book) {
        const bookApi = (process.env.REACT_BOOK_API || 'http://localhost:8080/api/books');
        const pathArgument = `${book["_id"]}`;

        const webResponse = await this.fetch(bookApi, pathArgument);

        webResponse["bookExists"] = webResponse["data"]["data"] !== undefined;
        delete webResponse["data"];

        return webResponse;
    }

    async getBook(bookId) {
        const bookApi = (process.env.REACT_BOOK_API || 'http://localhost:8080/api/books');
        const pathArgument = `${bookId}`;

        const webResponse = await this.fetch(bookApi, pathArgument);

        webResponse["book"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async getSeller(sellerId) {
        const userApi = (process.env.REACT_USERS_API || 'http://localhost:8080/api/users');

        const webResponse = await this.fetch(userApi, sellerId);

        webResponse["seller"] =  webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async removeCategory(categoryId) {
        const categoryApi = (process.env.REACT_CATEGORY_API || 'http://localhost:8080/api/categories');

        const authHeader = (new AuthenticationService()).authHeader();

        try {
            return await this.fetch(categoryApi, categoryId, 'DELETE', {}, authHeader);
        } catch (e) {
            return {msg: e.message, error: 1}
        }
    }
}
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

        return {msg: data["msg"], error: data["error"], data: data, webStatus: webResponseStatus};
    }

    async postUser(userCredentials) {
        const postUserApi = process.env.REACT_APP_USER_API;

        const webResponse = await this.fetch(postUserApi, "", 'POST', userCredentials);

        delete webResponse["data"];

        return webResponse;
    }

    async getUserByUsername(username) {
        const userApi = process.env.REACT_APP_USER_API,
            pathArgument = `username/${username}`;

        const webResponse = await this.fetch(userApi, pathArgument);

        webResponse["user"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async authenticateUser(userCredentials) {
        const authenticateUserApi = process.env.REACT_APP_AUTHENTICATE_USER_API;

        const webResponse = await this.fetch(authenticateUserApi, "", 'POST', userCredentials);

        webResponse["admin"] = webResponse["data"]["admin"];
        webResponse["token"] = webResponse["data"]["token"];
        webResponse["id"] = webResponse["data"]["userId"];

        delete webResponse["data"];

        return webResponse;
    }

    async postCategory(category) {
        const postCategoryApi = process.env.REACT_APP_CATEGORY_API;

        const authService = new AuthenticationService();

        const webResponse = await this.fetch(postCategoryApi, "", 'POST', category, authService.authHeader());

        webResponse["category"] = webResponse["data"]["data"];

        delete webResponse["data"];

        return webResponse;
    }

    async loadCategories() {
        const fetchCategories = process.env.REACT_APP_CATEGORY_API ;

        const webResponse = await this.fetch(fetchCategories);

        webResponse["categories"] = webResponse["data"]["data"];

        delete webResponse["data"];

        return webResponse;
    }

    async loadCategoryBooks(categoryId) {
        const fetchCategoryBooks = process.env.REACT_APP_CATEGORY_API;
        const pathArgument = `${categoryId}/books`;

        const webResponse = await this.fetch(fetchCategoryBooks, pathArgument);

        webResponse["books"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async getCategoryId(category) {
        const getCategoryId = process.env.REACT_APP_CATEGORY_ID_API;

        const webResponse = await this.fetch(getCategoryId, "", 'POST', {category: category});

        webResponse["category"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async getCategory(categoryId) {
        const categoryApi = process.env.REACT_APP_CATEGORY_API;

        const webResponse = await this.fetch(categoryApi, categoryId);

        webResponse["category"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async removeCategory(categoryId) {
        const categoryApi = process.env.REACT_APP_CATEGORY_API;

        const authHeader = (new AuthenticationService()).authHeader();

        return await this.fetch(categoryApi, categoryId, 'DELETE', {}, authHeader);
    }

    async postBook(book) {
        const postBookApi = process.env.REACT_APP_BOOK_API;
        const authHeader = new AuthenticationService().authHeader();

        const webResponse = await this.fetch(postBookApi, "", 'POST', book, authHeader);

        webResponse["book"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async bookExists(book) {
        const bookApi = process.env.REACT_APP_BOOK_API;
        const pathArgument = `${book["_id"]}`;

        const webResponse = await this.fetch(bookApi, pathArgument);

        webResponse["bookExists"] = webResponse["data"]["data"] !== undefined;
        delete webResponse["data"];

        return webResponse;
    }

    async getBook(bookId) {
        const bookApi = process.env.REACT_APP_BOOK_API;

        const webResponse = await this.fetch(bookApi, bookId);

        webResponse["book"] = webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }

    async getSeller(sellerId) {
        const userApi = process.env.REACT_APP_USER_API;

        const webResponse = await this.fetch(userApi, sellerId);

        webResponse["seller"] =  webResponse["data"]["data"];
        delete webResponse["data"];

        return webResponse;
    }
}
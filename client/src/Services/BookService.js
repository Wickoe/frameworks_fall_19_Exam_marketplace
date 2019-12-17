import AuthenticationService from "./AuthenticationService";
import FetchService from "./FetchService";

export default class BookService {
    constructor() {
        this.authService = new AuthenticationService();
        this.fetcher = new FetchService();
    }

    async postCategory(category) {
        if(!this.validCategoryInformation(category)) {
            return {error: 1, msg: "Invalid or missing information!"}
        }

        if(!this.authService.authenticatedUser()) {
            return {error: 1, msg: "Login in order to create a new category!"}
        }

        const postCategoryResponse = await this.fetcher.postCategory(category);

        if(postCategoryResponse["error"]) {
            postCategoryResponse["msg"] = "Something went wrong while posting the category. Please try again later!";
        }

        console.log(postCategoryResponse);
        postCategoryResponse["category"] = postCategoryResponse["category"];

        return postCategoryResponse;
    }

    validCategoryInformation(category) {
        return category["title"] !== undefined && category["title"].length > 0;
    }

    async loadCategories() {
        return await this.fetcher.loadCategories();
    }

    async loadCategoryBooks(categoryId) {
        return await this.fetcher.loadCategoryBooks(categoryId);
    }
}
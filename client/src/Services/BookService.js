import AuthenticationService from "./AuthenticationService";
import FetchService from "./FetchService";

export default class BookService {
    constructor() {
        this.authService = new AuthenticationService();
        this.fetcher = new FetchService();
    }

    async postCategory(category) {
        if (!this.validCategoryInformation(category)) {
            return {error: 1, msg: "Invalid or missing information!"}
        }

        if (!this.authService.authenticatedUser()) {
            return {error: 1, msg: "Login in order to create a new category!"}
        }

        const postCategoryResponse = await this.fetcher.postCategory(category);

        if (postCategoryResponse["error"]) {
            postCategoryResponse["msg"] = "Something went wrong while posting the category. Please try again later!";
        }

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

    async postBook(book) {
        const validBookInformation = this.validateBookInformation(book);

        if (validBookInformation["error"]) {
            return validBookInformation;
        }

        return (await this.fetcher.postBook(book))["book"];
    }

    validateBookInformation(bookInformation) {
        try {
            const bookTitle = bookInformation["title"],
                bookAuthor = bookInformation["author"],
                bookPrice = bookInformation["price"],
                bookCategory = bookInformation["category"];


            if(!bookTitle || bookTitle.length <= 0) {
                return {error: 1, msg: "Please enter the title of the book!"}
            }

            if(!bookAuthor || bookAuthor.length <= 0) {
                return {error: 1, msg: "Please enter the author of the book!"};
            }

            if(isNaN(bookPrice) || bookPrice <= 0) {
                return {error: 1, msg: "Select a price greater than '0' (zero)!"}
            }

            if (!bookCategory || bookCategory.length <= 0) {
                return {error: 1, msg: "Select a category for the book!"}
            }

            return {};
        } catch (e) {
            return {error: 1, msg: "Missing required information!"}
        }
    }

    async getCategoryId(category) {
        const categoryIdResponse = await this.fetcher.getCategoryId(category);

        if(categoryIdResponse["error"]) {
            throw Error("There is no such category!");
        }

        return categoryIdResponse["data"];
    }

    async bookExists(book) {
        const bookExistsResponse = await this.fetcher.bookExists(book);

        return !bookExistsResponse["error"] && bookExistsResponse["bookExists"];
    }

    async loadBook(bookId) {
        return await this.fetcher.getBook(bookId);
    }
}
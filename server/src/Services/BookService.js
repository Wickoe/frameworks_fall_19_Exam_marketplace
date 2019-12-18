class BookService {
    constructor(bookDal, categoryDal) {
        this.bookDal = bookDal;
        this.categoryDal = categoryDal;
    }

    async postBook(book) {
        const validBookInformation = await this.validateBookInformation(book);

        if(!validBookInformation) {
            return {msg: "Missing information", error: 1, data: {}};
        }

        book["category"] = (await this.categoryDal.getCategory(book["category"]))["_id"];

        try {
            const savedBook = await this.bookDal.saveBook(book);

            return {msg: "Book created!", data: savedBook};
        }catch (e) {
            return {msg: "Please try again later!", error: 2, data: {}}
        }
    }

    async validateBookInformation(book) {
        try {
            const title = book["title"],
                author = book["author"],
                bookCategory = book["category"],
                price = book["price"];

            const category = await this.categoryDal.getCategory(bookCategory);

            return title.length > 0 && author.length > 0 && category !== undefined && price > 0.0;
        } catch(e) {
            return false;
        }
    }

    async getBook(bookId) {
        try {
            const book = await this.bookDal.getBook(bookId);

            return {msg: `Loaded book ${bookId}`, data: book};
        } catch (e) {
            return {msg: `An error occurred while loading ${bookId}!`, error: 1, data: {}}
        }
    }

    async saveCategory(category) {
        if(!this.validCategoryInformation(category)) {
            return {error: 1, msg: "Received invalid or missing data!"};
        }

        try {
            return {data: await this.categoryDal.saveCategory(category), msg: `Category ${category["title"]} created!`};
        }catch (e) {
            return {error: 1, msg: "An error happened while creating the category. Please try again later!"}
        }
    }

    validCategoryInformation(category) {
        try {
            return category["title"] !== undefined && category["title"].length > 0;
        } catch (e) {
            return false;
        }
    }

    async getCategories() {
        return {categories: await this.categoryDal.getCategories()}
    }

    async getCategoryBooks(categoryId) {
        return await this.bookDal.getCategoryBooks(categoryId);
    }

    async getCategoryId(category) {
        const foundCategory = await this.categoryDal.getCategoryId(category["category"]);

        if(foundCategory === null) {
            return {error: 1, msg: "Category does not exists!"}
        }

        return foundCategory["_id"];
    }
}

module.exports = (bookDal, categoryDal) => new BookService(bookDal, categoryDal);
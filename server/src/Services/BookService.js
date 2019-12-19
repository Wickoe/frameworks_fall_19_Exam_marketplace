class BookService {
    constructor(bookDal, categoryDal, socketService) {
        this.bookDal = bookDal;
        this.categoryDal = categoryDal;
        this.socket = socketService;
    }

    async postBook(book, userId) {
        const validBookInformation = await this.validateBookInformation(book);

        if (!validBookInformation) {
            return {msg: "Missing information", error: 1, data: {}};
        }

        book["category"] = (await this.categoryDal.getCategoryByName(book["category"]))["_id"];
        book["seller"] = userId;

        try {
            const savedBook = await this.bookDal.saveBook(book);

            this.socket.emitNewBookAdded(savedBook["title"], savedBook["_id"]);

            return {msg: "Book created!", data: savedBook};
        } catch (e) {
            return {msg: "Please try again later!", error: 2, data: {}}
        }
    }

    async validateBookInformation(book) {
        try {
            const title = book["title"],
                author = book["author"],
                bookCategory = book["category"],
                price = book["price"];

            const category = await this.categoryDal.getCategoryByName(bookCategory);

            return title.length > 0 && author.length > 0 && category !== undefined && price > 0.0;
        } catch (e) {
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
        if (!this.validCategoryInformation(category)) {
            return {error: 1, msg: "Received invalid or missing data!"};
        }

        try {
            const newCategory = await this.categoryDal.saveCategory(category);

            // socket.emitNewCategoryAdded(newCategory["title"], newCategory["_id"]);

            return {data: newCategory, msg: `Category ${category["title"]} created!`};
        } catch (e) {
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

        if (foundCategory === null) {
            return {error: 1, msg: "Category does not exists!"}
        }

        return foundCategory["_id"];
    }

    async getCategory(categoryId) {
        const category = await this.categoryDal.getCategoryById(categoryId);

        return {msg: `Category for ${categoryId}`, data: category};
    }

    async getBooks() {
        return this.bookDal.getBooks();
    }

    async removeCategory(categoryId) {
        if(await this.isDefaultCategory(categoryId)) {
            return {msg: "The 'Default' category cannot be removed!"}
        }

        if(!(await this.validateCategory(categoryId))) {
            return {msg: "Category removed", error: 0};
        }

        const defaultCategory = await this.categoryDal.getDefaultCategory();
        const categoryBooks = await this.bookDal.getCategoryBooks(categoryId);

        try {
            categoryBooks.forEach(book => {
                this.bookDal.updateBookCategory(book["_id"], defaultCategory["_id"]);
            });

            const category = await this.categoryDal.removeCategory(categoryId);

            this.socket.emitCategoryRemoval(category["_title"], categoryId);

            return {msg: `Category ${category["title"]} removed!`}
        } catch (e) {
            return {msg: `An error occurred while trying to remove category ${categoryId}`};
        }
    }

    async isDefaultCategory(categoryId) {
        const defaultCategory = await this.categoryDal.getDefaultCategory();

        return categoryId === defaultCategory["_id"];
    }

    async validateCategory(categoryId) {
        const category = await this.categoryDal.getCategory(categoryId);

        return category !== null;
    }
}

module.exports = (bookDal, categoryDal) => new BookService(bookDal, categoryDal);
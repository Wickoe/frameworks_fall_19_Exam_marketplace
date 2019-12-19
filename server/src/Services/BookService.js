class BookService {
    constructor(bookDal, categoryDal, socketService) {
        this.bookDal = bookDal;
        this.categoryDal = categoryDal;
        this.socket = socketService;
    }

    async getBook(bookId) {
        try {
            const book = await this.bookDal.getBook(bookId);

            return {msg: `Loaded book ${bookId}`, data: book};
        } catch (e) {
            return {msg: `An error occurred while loading ${bookId}!`, error: 1, data: {}}
        }
    }

    async getBooks() {
        let books = await this.bookDal.getBooks();

        if(!books) {
            books = [];
        }

        return {msg: "All current books!", data: books};
    }

    async postBook(book, userId) {
        const validBookInformation = await this.validateBookInformation(book);

        if (!validBookInformation) {
            return {msg: "Missing information", error: 1, data: {}};
        }

        try {
            book["seller"] = userId;

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

            book["category"] = category["_id"];

            return title.length > 0 && author.length > 0 && category !== undefined && book["category"].length > 0 && price > 0.0;
        } catch (e) {
            return false;
        }
    }

    async saveCategory(category) {
        if (!(await this.validCategoryInformation(category))) {
            return {error: 1, msg: "Missing information or category already exists!"};
        }

        try {
            const newCategory = await this.categoryDal.saveCategory(category);

            // socket.emitNewCategoryAdded(newCategory["title"], newCategory["_id"]);

            return {data: newCategory, msg: `Category '${category["title"]}' created!`};
        } catch (e) {
            return {error: 1, msg: "An error happened while creating the category. Please try again later!"}
        }
    }

    async validCategoryInformation(category) {
        try {
            const categoryTitle = category["title"];

            const existingCategory = await this.categoryDal.getCategoryByName(categoryTitle);

            return existingCategory === null && categoryTitle !== undefined && categoryTitle.length > 0;
        } catch (e) {
            return false;
        }
    }

    async getCategories() {
        let categories = await this.categoryDal.getCategories();

        if(!categories) {
            categories = [];
        }

        return {msg: "Categories", data: categories};
    }

    async getCategoryBooks(categoryId) {
        let categoryBooks = await this.bookDal.getCategoryBooks(categoryId);

        if(!categoryBooks) {
            categoryBooks = [];
        }

        return {msg: `Books for category ${categoryId}`, data: categoryBooks};
    }

    async getCategoryId(category) {
        const foundCategory = await this.categoryDal.getCategoryId(category["category"]);

        if (foundCategory === null) {
            return {error: 1, msg: "Category does not exists!"}
        }

        return {msg: "Category", data: foundCategory, error: 0};
    }

    async getCategory(categoryId) {
        const category = await this.categoryDal.getCategory(categoryId);

        return {msg: `Category for ${categoryId}`, data: category};
    }

    async removeCategory(categoryId) {
        if(await this.isDefaultCategory(categoryId)) {
            return {msg: "The 'Default' category cannot be removed!"}
        }

        if(!(await this.validateCategory(categoryId))) {
            return {msg: "Category removed"};
        }

        try {
            const defaultCategory = await this.categoryDal.getDefaultCategory();
            const categoryBooks = await this.bookDal.getCategoryBooks(categoryId);

            categoryBooks.forEach(book => {
                this.bookDal.updateBookCategory(book["_id"], defaultCategory["_id"]);
            });

            const category = await this.categoryDal.removeCategory(categoryId);

            // this.socket.emitCategoryRemoval(category["_title"], categoryId);

            return {msg: `Category '${category["title"]}' removed!`}
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
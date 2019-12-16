class BookService {
    constructor(bookDal, categoryDal) {
        this.bookDal = bookDal;
        this.categoryDal = categoryDal;
    }

    async postBook(book) {
        if(!this.validateBookInformation(book)) {
            return {msg: "Missing information", error: 1, data: {}};
        }

        try {
            const book = await this.bookDal.saveBook(book);

            return {msg: "Book created!", data: book};
        }catch (e) {
            return {msg: "Please try again later!", error: 2, data: {}}
        }
    }

    validateBookInformation(book) {
        try {
            const title = book["title"],
                author = book["author"],
                category = book["category"],
                price = book["price"];

            return title.length > 0 && author.length > 0 && category.length > 0 && price > 0.0;
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
}

module.exports = (bookDal, categoryDal) => new BookService(bookDal, categoryDal);
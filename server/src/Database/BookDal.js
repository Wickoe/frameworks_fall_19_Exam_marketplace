class BookDal {
    constructor(database) {
        const bookSchema = database.Schema({
            title: String,
            author: String,
            category: String,
            price: Number
        });

        this.bookModel = database.model("Book", bookSchema);
    }

    async getBooks() {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }

    async getBook(id) {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }

    async saveBook(book) {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }
}

module.exports = (database) => new BookDal(database);
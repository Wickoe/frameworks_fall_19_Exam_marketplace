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
        return this.bookModel.findOne({_id: id});
    }

    async saveBook(book) {
        const bookModel = this.bookModel(book);

        return bookModel.save();
    }

    async getCategoryBooks(categoryId) {
        return this.bookModel.find({category: categoryId});
    }
}

module.exports = (database) => new BookDal(database);
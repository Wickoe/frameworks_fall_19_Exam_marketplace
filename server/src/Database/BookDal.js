class BookDal {
    constructor(database) {
        const bookSchema = database.Schema({
            title: String,
            author: String,
            category: String,
            price: Number,
            seller: String
        });

        this.bookModel = database.model("Book", bookSchema);
    }

    async getBook(id) {
        return this.bookModel.findOne({_id: id});
    }

    async getBooks() {
        return this.bookModel.find();
    }

    async getCategoryBooks(categoryId) {
        return this.bookModel.find({category: categoryId});
    }

    async saveBook(book) {
        const bookModel = this.bookModel(book);

        return bookModel.save();
    }

    async updateBookCategory(bookId, category) {
        const book = await this.bookModel.findOne({_id: bookId});

        book["category"] = category;

        return await book.save();
    }
}

module.exports = (database) => new BookDal(database);
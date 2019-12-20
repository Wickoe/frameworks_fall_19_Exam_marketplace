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

    async bootstrapBooks(categoryDal, userDal, count = 10) {
        let l = (await this.getBooks()).length;

        if (l === 0) {
            let promises = [];

            const categories = await categoryDal.getCategories();
            const krdo = await userDal.getUserByUsername("krdo");

            categories.forEach(category => {
                for (let i = 0; i < count; i++) {
                    let question = new this.bookModel({
                        title: `How does this work?${i}`,
                        author: "Kristian",
                        category: category["_id"],
                        price: (i + 1),
                        seller: krdo["_id"]
                    });
                    promises.push(question.save());
                }
            });

            return Promise.all(promises);
        }
    }
}

module.exports = (database) => new BookDal(database);
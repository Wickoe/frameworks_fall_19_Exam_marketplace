class CategoryDal {
    constructor(categoryDal) {
        const categorySchema = categoryDal.Schema({
            name: String,
            description: String
        });

        this.categoryModel = categoryDal.model("Category", categorySchema)
    }

    async saveCategory(category) {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }

    async getCategories() {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }
}

module.exports = database => new CategoryDal(database);
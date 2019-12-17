class CategoryDal {
    constructor(categoryDal) {
        const categorySchema = categoryDal.Schema({
            title: String,
            description: String
        });

        this.categoryModel = categoryDal.model("Category", categorySchema)
    }

    async saveCategory(category) {
        return this.categoryModel(category).save();
    }

    async getCategories() {
        return this.categoryModel.find();
    }
}

module.exports = database => new CategoryDal(database);
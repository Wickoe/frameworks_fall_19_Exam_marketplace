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

    async getCategory(category) {
        return this.categoryModel.findOne({title: category});
    }

    async getCategoryId(category) {
        let foundCategory = await this.categoryModel.findOne({title: category});

        if(foundCategory === null) {
           foundCategory = await this.categoryModel.findOne({_id: category});
        }

        return foundCategory
    }
}

module.exports = database => new CategoryDal(database);
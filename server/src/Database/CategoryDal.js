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
        return this.categoryModel.findOne({_id: category});
    }

    async getCategoryByName(categoryTitle) {
        return this.categoryModel.findOne({title: categoryTitle});
    }

    async getCategoryById(categoryId) {
        return this.categoryModel.findOne({_id: categoryId});
    }

    async getCategoryId(category) {
        let foundCategory = await this.categoryModel.findOne({title: category});

        if(foundCategory === null) {
           foundCategory = await this.categoryModel.findOne({_id: category});
        }

        return foundCategory
    }

    async getDefaultCategory() {
        const defaultCategory = await this.categoryModel.findOne({title: "Default"});

        if(!defaultCategory) {
            return await this.saveCategory({title: "Default"});
        }

        return defaultCategory;
    }

    async removeCategory(categoryId) {
        return this.categoryModel.deleteOne({_id: categoryId});
    }
}

module.exports = database => new CategoryDal(database);
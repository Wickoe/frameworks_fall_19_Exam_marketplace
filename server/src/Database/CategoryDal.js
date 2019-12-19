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

    async getCategory(categoryId) {
        return this.categoryModel.findOne({_id: categoryId});
    }

    async getCategoryByName(categoryTitle) {
        return this.categoryModel.findOne({title: categoryTitle});
    }

    async getCategoryId(category) {
        let foundCategory = await this.categoryModel.findOne({title: category}).select("_id");

        if(foundCategory === null) {
           foundCategory = await this.categoryModel.findOne({_id: category}).select("_id");
        }

        return foundCategory;
    }

    async getDefaultCategory() {
        const defaultCategory = await this.categoryModel.findOne({title: "Default"});

        if(!defaultCategory) {
            return await this.saveCategory({title: "Default"});
        }

        return defaultCategory;
    }

    async removeCategory(categoryId) {
        const categoryTitle = await this.categoryModel.findOne({_id: categoryId}).select("title");
        await this.categoryModel.deleteOne({_id: categoryId});
        return categoryTitle;
    }
}

module.exports = database => new CategoryDal(database);
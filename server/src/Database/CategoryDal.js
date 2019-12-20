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

    async bootstrapCategories(count= 10) {
        let l = (await this.getCategories()).length;

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let question = new this.categoryModel({
                    title: `How does this work?${i}`
                });
                promises.push(question.save());
            }

            return Promise.all(promises);
        }
    }
}

module.exports = database => new CategoryDal(database);
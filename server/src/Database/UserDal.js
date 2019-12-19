class UserDal {
    constructor(database) {
        const userSchema = new database.Schema({
            username: String,
            password: String,
            admin: Boolean,
            email: String,
            name: String
        });

        this.userModel = database.model('User', userSchema);
    }

    async getUsers() {
        return this.userModel.find({privateProfile: false}).select('-password -privateProfile -_id -__v');
    }

    async findUserByUserName(username) {
        return this.userModel.findOne({username: username});
    }

    async saveUser(userInformation) {
        const userModel = this.userModel(userInformation);

        return userModel.save();
    }

    async getUser(id) {
        return this.userModel.findOne({_id: id}).select("-password -admin");
    }

    async getUserByUsername(username) {
        return this.userModel.findOne({username: username}).select("-password -admin");
    }
}

module.exports = (database) => new UserDal(database);
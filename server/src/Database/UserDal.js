const bcrypt = require('bcryptjs');

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

    async bootstrapTestUsers() {
        let l = (await this.getUsers()).length;
        if (l !== 0) return;

        const users = [
            { username: "krdo", password: '123', name: "kristian", admin: true, email: "superSecretEmail"},
            { username: "tosk", password: 'password', name: "Mille", admin: false, email: "superSecretEmail"},
            { username: "mvkh", password: 'l33th0xor', name: "Niels", admin: false, email: "superSecretEmail"},
        ];

        let promises = [];
        users.forEach(user => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                user.password = hash;

                let newUser = new this.userModel(user);
                promises.push(newUser.save());
            });
        });

        return Promise.all(promises);
    }
}

module.exports = (database) => new UserDal(database);
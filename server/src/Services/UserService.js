class UserService {
    constructor(userDal) {
        this.userDal = userDal;
    }

    async getUsers() {
        try {
            let users = await this.userDal.getUsers();

            if(!users) {
                users = [];
            }

            return {msg: "Users", data: users};
        } catch (e) {
            return {msg: "Something went wrong while loading the users. Please try again later!", error: 1}
        }
    }

    async createUser(userInformation) {
        const userInformationValidationResponse = await this.validateUserInformation(userInformation);

        if (userInformationValidationResponse["error"]) {
            return {error: 1, msg: "Missing user information!"};
        }

        try {
            await this.userDal.saveUser(userInformation);

            return {msg: "User created!"};
        } catch (e) {
            return {error: 1, msg: "An error happened while creating user account!"}
        }
    }

    async validateUserInformation(userInformation) {
        try {
            const username = userInformation["username"],
                password = userInformation["password"],
                admin = userInformation["admin"];

            const existingUser = await this.userDal.getUserByUsername(username);

            if(existingUser === null && username.length > 0 && password.length >= 8 && (admin === true || admin === false)){
                return {msg: "Valid userinformation!", error: 0}
            }

            return {msg: "Missing user information!"}
        }catch (e) {
            return {msg: "Something went wrong creating the user account. Please try again later!", error: 1}
        }
    }

    async getUser(userId) {
        const user = await this.userDal.getUser(userId);
        return {msg: `User ${userId}`, data: user};
    }

    async getUserByUsername(username) {
        const user = await this.userDal.getUserByUsername(username);

        if(user !== null) {
            return {msg: `User ${username}`, data: user};
        }

        return {msg: "User does not exists!", error: 1};
    }
}

module.exports = (userDal) => new UserService(userDal);
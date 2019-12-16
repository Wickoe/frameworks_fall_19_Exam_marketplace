class UserService {
    constructor(userDal) {
        this.userDal = userDal;
    }

    async getUsers() {
        const response = {msg: "Users"};

        try {
            response["data"] = await this.userDal.getPublicUsers();
        } catch (e) {
            response["error"] = 1;
            response["msg"] = "Completed with errors!";
        }

        return response;
    }

    validateInformation(userInformation) {
        //TODO - implement a more thorough user validation as the user schema evolves
        const privateProfile = userInformation["privateProfile"];

        return privateProfile !== undefined && (privateProfile === false || privateProfile === true);
    }

    async createUser(userInformation) {
        if (!this.validateInformation(userInformation)) {
            return {error: 1, msg: "Missing user information!"};
        }

        // TODO - check if user already exists

        try {
            await this.userDal.saveUser(userInformation);
            return {msg: "User created!"};
        } catch (e) {
            return {error: 1, msg: "An error happened while creating user account!"}
        }
    }

    async getUser(id) {
        return await this.userDal.getUser(id);
    }
}

module.exports = (userDal) => new UserService(userDal);
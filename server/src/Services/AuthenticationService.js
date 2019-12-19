class AuthenticationService {
    constructor(userDal, secret, encryptionAlgorithm, tokenAlgorithm, encryptionLevel) {
        this.userDal = userDal;
        this.secret = secret;
        this.encryption = encryptionAlgorithm;
        this.tokenAlgorithm = tokenAlgorithm;
        this.encryptionLevel = encryptionLevel;
        this.tokenExpirationLength = {expiresIn: `${(process.env.TOKEN_LIFE || "1h")}`};
        this.passwordValidationRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{${process.env.MINIMUM_PASSWORD_LENGTH || 8},})`);
    }

    async encryptAccount(accountInformation) {
        if (!this.validateAccountInformation(accountInformation)) {
            return this.errorOccurred("An error occurred! Please try again later");
        }

        const hashedPassword = await this.encryption.hash(accountInformation["password"], this.encryptionLevel);
        delete accountInformation["password"];

        return {...accountInformation, password: hashedPassword};
    }

    async validateAccountInformation(accountInformation) {
        return await this.validateUsername(accountInformation["username"]) && this.validatePassword(accountInformation["password"])
    }

    async validateUsername(username) {
        let valid = username !== undefined && username.length > 0;

        if(valid) {
            const user = await this.userDal.getUserByUsername(username);

            valid = user === null;
        }

        return valid;
    }

    validatePassword(password) {
        return this.passwordValidationRegex.test(password);
    }

    errorOccurred(msg) {
        return {msg: msg, error: 1}
    }

    async authenticate(userCredentials) {
        const username = userCredentials["username"],
            password = userCredentials["password"];

        const user = await this.userDal.findUserByUserName(username);

        if (!user) {
            return this.errorOccurred("Invalid username or password!");
        }

        const comparisonResult = await this.encryption.compare(password, user["password"]);

        if (!comparisonResult) {
            return this.errorOccurred("Invalid username or password!");
        }

        const payload = {userId: user["_id"], username: username, admin: user["admin"]},
            token = await this.tokenAlgorithm.sign(payload, this.secret, this.tokenExpirationLength);

        return {msg: `User ${username} logged in!`, token: token, admin: user["admin"], userId: user["_id"]};
    }
}

module.exports = (userDatabase,
                  securitySecret,
                  encryptionAlgorithm,
                  tokenAlgorithm,
                  encryptionLevel) => new AuthenticationService(userDatabase, securitySecret, encryptionAlgorithm, tokenAlgorithm, encryptionLevel);
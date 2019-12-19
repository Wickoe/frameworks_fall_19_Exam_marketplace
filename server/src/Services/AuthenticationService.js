class AuthenticationService {
    constructor(userDal, secret, encryptionAlgorithm, tokenAlgorithm, encryptionLevel) {
        this.userDal = userDal;
        this.secret = secret;
        this.encryption = encryptionAlgorithm;
        this.tokenAlgorithm = tokenAlgorithm;
        this.encryptionLevel = encryptionLevel;
        this.minPasswordLength = (process.env.MINIMUM_PASSWORD_LENGTH || 8);
        this.tokenExpirationLength = {expiresIn: `${(process.env.TOKEN_LIFE || "1h")}`}
    }

    async encryptAccount(accountInformation) {
        if (!this.validateAccountInformation(accountInformation)) {
            return this.errorOccurred("An error occurred! Please try again later");
        }

        const hashedPassword = await this.encryptPassword(accountInformation["password"]);
        delete accountInformation["password"];

        return {...accountInformation, password: hashedPassword};
    }

    async validateAccountInformation(accountInformation) {
        return await this.validateUsername(accountInformation["username"]) && this.validatePassword(accountInformation["password"])
    }

    async validateUsername(username) {
        return await this.userDal.findUserByUserName(username) === null;
    }

    validatePassword(password) {
        const passwordValidationRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{${this.minPasswordLength},})`);

        return String(password).length >= this.minPasswordLength && passwordValidationRegex.test(password)
    }

    errorOccurred(msg) {
        return {msg: msg, error: 1}
    }

    async encryptPassword(password) {
        return await this.encryption.hash(password, this.encryptionLevel);
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
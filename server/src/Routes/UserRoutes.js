module.exports = (authService, userService) => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getUsers(req, res))
        .post((req, res) => postUser(req, res));

    router.route('/authenticate')
        .post((req, res) => authenticateUser(req, res));

    /** Functionality **/
    async function getUsers(req, res) {
        const usersResponse = await userService.getUsers();

        if (!usersResponse["data"]) {
            usersResponse["data"] = [];
        }

        return res.json(usersResponse);
    }

    async function postUser(req, res) {
        const userInformation = req.body;

        const encryptedUserAccount = await authService.encryptAccount(userInformation);

        if(encryptedUserAccount["error"]) {
            return res.status(500).json(encryptedUserAccount);
        }

        return res.json(await userService.createUser(encryptedUserAccount));
    }

    async function authenticateUser(req, res) {
        const userCredentials = req.body;

        if (!userCredentials["username"] || !userCredentials["password"]) {
            return res.status(400).json({error: 1, msg: "Invalid username or password!"});
        }

        const authenticationResponse = await authService.authenticate(userCredentials);

        if(authenticationResponse["error"]) {
            return res.status(400);
        }

        return res.json(authenticationResponse);
    }

    /* Router export */
    return router;
};
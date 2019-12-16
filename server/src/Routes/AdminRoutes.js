module.exports = _ => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getAdminView(req, res));

    /* Functionality */
    async function getAdminView(req, res) {
        if(!req.user["admin"])
            return req.status(501).redirect("/");

        return res.sendFile(path.resolve('..', 'client', 'build', 'index.html'));
    }

    return router;
};
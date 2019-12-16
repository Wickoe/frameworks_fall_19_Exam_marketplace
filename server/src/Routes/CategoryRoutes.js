module.exports = (bookService) => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getCategories(req, res))
        .post((req, res) => postCategory(req, res));

    /* Functionality */
    async function getCategories(req, res){
        // TODO - implement functionality
        throw Error("Missing implementation");
    }

    async function postCategory(req, res) {
        // TODO - implement functionality
        throw Error("Missing implementation");
    }

    return router;
};
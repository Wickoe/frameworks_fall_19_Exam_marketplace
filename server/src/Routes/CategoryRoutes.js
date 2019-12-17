module.exports = (bookService) => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getCategories(req, res))
        .post((req, res) => postCategory(req, res));

    /* Functionality */
    async function getCategories(req, res){
        const categoriesResponse = await bookService.getCategories();

        if(categoriesResponse["error"]) {
            categoriesResponse["categories"] = [];
        }

        return res.json(categoriesResponse);
    }

    async function postCategory(req, res) {
        const category = req.body;

        const response = await bookService.saveCategory(category);

        if(response["error"]) {
            res.status(500);
        }

        return res.json(response);
    }

    return router;
};
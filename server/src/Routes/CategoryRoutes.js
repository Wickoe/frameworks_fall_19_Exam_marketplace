module.exports = (bookService) => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getCategories(req, res))
        .post((req, res) => postCategory(req, res));

    router.route('/:id/books')
        .get((req, res) => getCategoryBooks(req, res));

    router.route('/categoryId')
        .post((req, res) => getCategoryId(req, res));

    /* Functionality */
    async function getCategories(req, res) {
        const categoriesResponse = await bookService.getCategories();

        if (categoriesResponse["error"]) {
            categoriesResponse["categories"] = [];
        }

        return res.json(categoriesResponse);
    }

    async function postCategory(req, res) {
        const category = req.body;

        const response = await bookService.saveCategory(category);

        if (response["error"]) {
            res.status(500);
        }

        return res.json(response);
    }

    async function getCategoryBooks(req, res) {
        const categoryId = req.params["id"];

        const categoryBooks = await bookService.getCategoryBooks(categoryId);

        return res.json(categoryBooks);
    }

    async function getCategoryId(req, res) {
        const categoryIdResponse = await bookService.getCategoryId(req.body);

        if (categoryIdResponse["error"]) {
            return res.json(categoryIdResponse);
        }

        return res.json({msg: "Category id", data: categoryIdResponse})
    }

    return router;
};
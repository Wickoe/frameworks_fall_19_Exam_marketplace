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

    router.route('/:id')
        .get((req, res) => getCategory(req, res));

    /* Functionality */
    async function getCategories(req, res) {
        const categoriesResponse = await bookService.getCategories();

        return res.json(categoriesResponse);
    }

    async function postCategory(req, res) {
        const category = req.body;

        const response = await bookService.saveCategory(category);

        return res.json(response);
    }

    async function getCategoryBooks(req, res) {
        const categoryId = req.params["id"];

        const categoryBooks = await bookService.getCategoryBooks(categoryId);

        return res.json(categoryBooks);
    }

    async function getCategoryId(req, res) {
        const category = req.body;

        const categoryIdResponse = await bookService.getCategoryId(category);

        return res.json(categoryIdResponse);
    }

    async function getCategory(req, res) {
        const categoryId = req.params.id;

        const categoryResponse = await bookService.getCategory(categoryId);

        return res.json(categoryResponse);
    }

    return router;
};
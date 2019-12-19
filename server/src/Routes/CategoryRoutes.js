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
        // .put((req, res) => deleteCategory(req, res));

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

    async function getCategory(req, res) {
        const categoryId = req.params.id;

        const categoryResponse = await bookService.getCategory(categoryId);

        return res.json(categoryResponse);
    }

    // async function deleteCategory(req, res) {
    //     if(!req.user["admin"]) {
    //         res.status(401).json({msg: `User is unauthorized!`, error: 1});
    //     }
    //
    //     const categoryId = req.params["id"];
    //
    //     const removeCategoryResponse = await bookService.removeCategory(categoryId);
    //
    //     return res.json(removeCategoryResponse);
    // }

    return router;
};
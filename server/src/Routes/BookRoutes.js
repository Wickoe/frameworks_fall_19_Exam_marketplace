module.exports = (bookService) => {
    const router = require('express').Router();

    /* Routes */
    router.route('/')
        .get((req, res) => getBooks(req, res))
        .post((req, res) => postBook(req, res));

    router.route('/:id')
        .get((req, res) => getBook(req, res));

    /* Functionality */
    async function getBooks(req, res) {
        const booksResponse = await bookService.getBooks();

        if(booksResponse["error"]) {
            res.status(501);
        }

        return res.json(booksResponse);
    }

    async function postBook(req, res) {
        const newBook = req.body;
        const user = req.user.userId;

        const postBookResponse = await bookService.postBook(newBook, user);

        const responseError = postBookResponse["error"];

        if(responseError) {
            if (responseError === 1)
                res.status(400);
            else
                res.status(501);
        }

        return res.json(postBookResponse)
    }

    async function getBook(req, res) {
        const bookId = req.params.id;

        const bookResponse = await bookService.getBook(bookId);

        const responseError = bookResponse["error"];

        if(responseError) {
            res.status(501);
        }

        return res.json(bookResponse);
    }

    return router;
};
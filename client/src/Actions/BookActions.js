/* Libraries */
import BookService from "../Services/BookService";
import {showNotificationAction} from "./NotificationActions";

const {navigate} = require("@reach/router/lib/history");

const bookService = new BookService();

/* Actions */
const updateCategory = category => ({
    type: 'UPDATE_CATEGORY',
    category: category
});

const postCategory = category => async function (dispatch) {
    const displayTimer = 2000;
    const categoryCreationResponse = await bookService.postCategory(category);


    if (categoryCreationResponse["error"]) {
        dispatch(showNotificationAction(categoryCreationResponse["msg"], 2, displayTimer));
        return;
    }

    dispatch(showNotificationAction(categoryCreationResponse["msg"], 1, displayTimer));
    dispatch(updateCategory(categoryCreationResponse["category"]));
};

const removeCategory = category => ({
    type: 'REMOVE_CATEGORY',
    category: category
});

const removeCategoryAction = category => async function(dispatch) {
    const displayTimer = 2000;

    const removeCategoryResponse = await bookService.removeCategory(category);

    if(removeCategoryResponse["error"]) {
        return dispatch(showNotificationAction(removeCategoryResponse["msg"], 2, displayTimer));
    }

    dispatch(removeCategory(category));
    dispatch(showNotificationAction(removeCategoryResponse["msg"], 1, displayTimer));
};

const updateCategories = categories => ({
    type: 'UPDATE_CATEGORIES',
    categories: categories
});

const loadCategories = _ => async function (dispatch) {
    const displayTimer = 2000;
    const fetchCategoriesResponse = await bookService.loadCategories();

    dispatch(showNotificationAction(fetchCategoriesResponse["msg"], 1, displayTimer));

    if (fetchCategoriesResponse["error"]) {
        dispatch(updateCategories([]));
        return;
    }

    dispatch(updateCategories(fetchCategoriesResponse["categories"]))
};

const updateBooks = books => ({
    type: 'UPDATE_BOOKS',
    books: books
});

const updateCategoryBooks = books => ({
    type: 'UPDATE_CATEGORY_BOOKS',
    books: books
});

const loadCategoryBooks = (category, books) => async function (dispatch) {
    const displayTimer = 2000;
    let categoryBooks = [];

    try {
        const categoryId = await bookService.getCategoryId(category);

        categoryBooks = books.filter(book =>
            book["category"] === categoryId
        );

        if (categoryBooks.length <= 0) {
            categoryBooks = await bookService.loadCategoryBooks(categoryId)
        }
    } catch (e) {
        dispatch(showNotificationAction("Invalid category!", 2, displayTimer))
    }

    dispatch(updateBooks(categoryBooks));
    dispatch(updateCategoryBooks(categoryBooks));
};

const postBook = book => async function (dispatch) {
    const displayTimer = 2000;

    const postBookResponse = await bookService.postBook(book);

    // TODO
    if (!postBookResponse["error"]) {
        dispatch(updateBooks([postBookResponse["data"]]));
    }

    dispatch(showNotificationAction(postBookResponse["msg"], 1, displayTimer));
};

const loadBook = (bookId, books) => async function (dispatch) {
    let book = books.find(book => book["_id"] === bookId);

    if (book === undefined) {
        const loadBookResponse = await bookService.loadBook(bookId);

        if (!loadBookResponse["error"]) {
            book = loadBookResponse["book"];
        }
    }

    const bookExists = await bookService.bookExists(book);

    if (bookExists) {
        const seller = await bookService.getSeller(book["seller"]);
        const bookCategory = await bookService.getBookCategory(book["category"]);

        dispatch(updateBookSeller(seller, bookCategory));

        return dispatch(updateBook(book));
    }

    dispatch(showNotificationAction("Book does not exists!"));
    return navigate('/');
};

const updateBookSeller = (seller, category) => ({
    type: 'UPDATE_SELLING_BOOK',
    seller: seller,
    category: category
});

const updateBook = book => ({
    type: 'UPDATE_BOOK',
    book: book
});

export {postCategory, loadCategories, loadCategoryBooks, postBook, loadBook, removeCategoryAction}
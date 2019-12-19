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

const updateBookSeller = (seller, category) => ({
    type: 'UPDATE_SELLING_BOOK',
    seller: seller,
    category: category
});

const updateBook = book => ({
    type: 'UPDATE_BOOK',
    book: book
});

const removeCategory = category => ({
    type: 'REMOVE_CATEGORY',
    category: category
});

const updateCategories = categories => ({
    type: 'UPDATE_CATEGORIES',
    categories: categories
});

const updateBooks = books => ({
    type: 'UPDATE_BOOKS',
    books: books
});

const updateCategoryBooks = books => ({
    type: 'UPDATE_CATEGORY_BOOKS',
    books: books
});

const displayNotification = (msg, level) => async function(dispatch) {
    dispatch(showNotificationAction(msg, level, process.env.REACT_APP_DISPLAY_NOTIFICATION_TIMER))
};

const postCategory = category => async function (dispatch) {
    const categoryCreationResponse = await bookService.postCategory(category);

    if (categoryCreationResponse["error"]) {
        return dispatch(displayNotification(categoryCreationResponse["msg"], 2));
    }

    dispatch(displayNotification(categoryCreationResponse["msg"], 1));
    dispatch(updateCategory(categoryCreationResponse["category"]));
};

const removeCategoryAction = category => async function(dispatch) {
    const removeCategoryResponse = await bookService.removeCategory(category);

    if(removeCategoryResponse["error"]) {
        return dispatch(displayNotification(removeCategoryResponse["msg"], 2));
    }

    dispatch(removeCategory(category));
    dispatch(displayNotification(removeCategoryResponse["msg"], 1));
};

const loadCategories = _ => async function (dispatch) {
    const fetchCategoriesResponse = await bookService.loadCategories();

    dispatch(displayNotification(fetchCategoriesResponse["msg"], 1));

    if (fetchCategoriesResponse["error"]) {
        return dispatch(updateCategories([]));
    }

    dispatch(updateCategories(fetchCategoriesResponse["categories"]))
};

const loadCategoryBooks = (category, books) => async function (dispatch) {
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
        dispatch(displayNotification("Invalid category!", 2));
    }

    dispatch(updateBooks(categoryBooks));
    dispatch(updateCategoryBooks(categoryBooks));
};

const postBook = book => async function (dispatch) {
    const postBookResponse = await bookService.postBook(book);

    // TODO
    if (!postBookResponse["error"]) {
        dispatch(updateBooks([postBookResponse["data"]]));
    }

    dispatch(displayNotification(postBookResponse["msg"], 1));
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

    dispatch(displayNotification("Book does not exists!", 1));
    navigate('/');
};

export {postCategory, loadCategories, loadCategoryBooks, postBook, loadBook, removeCategoryAction}
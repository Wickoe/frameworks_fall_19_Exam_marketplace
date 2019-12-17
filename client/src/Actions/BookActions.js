/* Libraries */
import BookService from "../Services/BookService";
import {showNotificationAction} from "./NotificationActions";

const bookService = new BookService();

/* Actions */
const updateCategory = category => ({
    type: 'UPDATE_CATEGORY',
    category: category
});

const postCategory = category => async function(dispatch) {
    const displayTimer = 2000;
    const categoryCreationResponse = await bookService.postCategory(category);


    if(categoryCreationResponse["error"]) {
        dispatch(showNotificationAction(categoryCreationResponse["msg"], 2, displayTimer));
        return;
    }

    dispatch(showNotificationAction(categoryCreationResponse["msg"], 1, displayTimer));
    dispatch(updateCategory(categoryCreationResponse["category"]));
};

const updateCategories = categories => ({
    type: 'UPDATE_CATEGORIES',
    categories: categories
});

const loadCategories = _ => async function(dispatch) {
    const displayTimer = 2000;
    const fetchCategoriesResponse = await bookService.loadCategories();

    dispatch(showNotificationAction(fetchCategoriesResponse["msg"], 1, displayTimer));

    if(fetchCategoriesResponse["error"]) {
        dispatch(updateCategories([]));
        return;
    }

    dispatch(updateCategories(fetchCategoriesResponse["categories"]))
};

const updateBooks = books => ({
    type: 'UPDATE_BOOKS',
    books: books
});

const loadCategoryBooks = categoryId => async function(dispatch) {
    const displayTimer = 2000;

    const loadBookResponse = await bookService.loadCategoryBooks(categoryId);
    dispatch(updateBooks(loadBookResponse["books"]));
};

export {postCategory, loadCategories, loadCategoryBooks}